import express from "express";
import path from "path";
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";

// Initialize Express app
const app = express();

// Define the base directory for the YAML files
const baseDir = path.join(__dirname, "openapi");

// Helper function to load referenced YAML files
function loadYamlRef(basePath: string, refPath: string): any {
  const filePath = path.resolve(basePath, refPath);
  console.log(`Loading YAML reference from: ${filePath}`); // Debugging
  return YAML.load(filePath);
}

// Merge the referenced files into the main document
function mergeYamlRefs(doc: any, basePath: string): any {
  if (typeof doc === "object" && doc !== null) {
    for (const key in doc) {
      if (doc.hasOwnProperty(key)) {
        if (key === "$ref") {
          const refContent = loadYamlRef(basePath, doc[key]);
          return mergeYamlRefs(
            refContent,
            path.dirname(path.resolve(basePath, doc[key]))
          );
        } else {
          doc[key] = mergeYamlRefs(doc[key], basePath);
        }
      }
    }
  }
  return doc;
}

// Load the main YAML file
const mainYamlPath = path.join(baseDir, "main.yaml");
const mainDocument = YAML.load(mainYamlPath);
console.log("Main document loaded:", mainDocument); // Debugging
const mergedDocument = mergeYamlRefs(mainDocument, baseDir);
console.log("Merged document:", mergedDocument); // Debugging

// Serve the merged YAML document with Swagger UI
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(mergedDocument));
console.log("Merged YAML served on /api-docs");

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
