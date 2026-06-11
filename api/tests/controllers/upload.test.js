const request = require("supertest");
const fs = require("fs");
const path = require("path");
const app = require("../../app");

describe("/upload Endpoints", () => {
  const dummyFilePath = path.join(__dirname, "temp-test-image.png");

  beforeAll(() => {
    // Generating temporary file on disk for supertest attachment actions
    fs.writeFileSync(dummyFilePath, "mock binary text or buffer contents");
  });

  afterAll(() => {
    // Cleaning up temporary test file
    if (fs.existsSync(dummyFilePath)) {
      fs.unlinkSync(dummyFilePath);
    }
    
    // Cleaning up files generated inside the uploads during testing
    const uploadsDir = path.join(__dirname, "../uploads");
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        if (file !== ".gitkeep") {
          fs.unlinkSync(path.join(uploadsDir, file));
        }
      }
    }
  });

  test("POST /upload uploads file successfully when attached under key field 'image'", async () => {
    const response = await request(app)
      .post("/upload")
      .attach("image", dummyFilePath);

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("imageUrl");
    expect(response.body.imageUrl).toContain("/uploads/");
  });

  test("POST /upload throws a 400 bad request error code when 'image' is missing", async () => {
    const response = await request(app)
      .post("/upload")
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toEqual("No file uploaded");
  });
});