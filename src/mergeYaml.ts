import path from "path";
import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";
import express from "express"; // Assuming app is an Express application

const app = express(); // Replace this with your actual app import

// Define the base directory for the YAML files
const baseDir = path.join(__dirname, "openapi");

// Helper function to load referenced YAML files
function loadYamlRef(basePath: string, refPath: string): any {
  const filePath = path.resolve(basePath, refPath);
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
const mergedDocument = mergeYamlRefs(mainDocument, baseDir);

// Serve the merged YAML document with Swagger UI
const swaggerDocs = (app: express.Express) => {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(mergedDocument));
};

export default swaggerDocs;
