const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const projectService = require("../src/services/projectService");
const Project = require("../src/models/Project");

let mongoServer;

beforeAll(async () => {
  // Start in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Clean up and disconnect
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Project Service", () => {
  it("should create a new project", async () => {
    const data = {
      title: "Test Project",
      description: "A test project",
      image: "test.jpg",
      link: "http://example.com",
    };
    const project = await projectService.createProject(data);
    expect(project.title).toBe("Test Project");
    expect(project.description).toBe("A test project");
  });

  it("should get all projects", async () => {
    // Create two projects first
    const data1 = {
      title: "Project 1",
      description: "Description 1",
      image: "image1.jpg",
      link: "http://project1.com",
    };
    const data2 = {
      title: "Project 2",
      description: "Description 2",
      image: "image2.jpg",
      link: "http://project2.com",
    };
    await projectService.createProject(data1);
    await projectService.createProject(data2);

    const projects = await projectService.getAllProjects();
    expect(projects.length).toBeGreaterThanOrEqual(2);
  });

  it("should get a project by id", async () => {
    const data = {
      title: "GetById Project",
      description: "Test get project by id",
      image: "getbyid.jpg",
      link: "http://getbyid.com",
    };
    const createdProject = await projectService.createProject(data);
    const foundProject = await projectService.getProjectById(createdProject._id);
    expect(foundProject).not.toBeNull();
    expect(foundProject.title).toBe("GetById Project");
  });

  it("should update a project", async () => {
    const data = {
      title: "Old Project Title",
      description: "Old description",
      image: "old.jpg",
      link: "http://old.com",
    };
    const createdProject = await projectService.createProject(data);

    const updateData = {
      title: "New Project Title",
      description: "New description",
    };
    const updatedProject = await projectService.updateProject(createdProject._id, updateData);
    expect(updatedProject.title).toBe("New Project Title");
    expect(updatedProject.description).toBe("New description");
  });

  it("should delete a project", async () => {
    const data = {
      title: "Project to delete",
      description: "This project will be deleted",
      image: "delete.jpg",
      link: "http://delete.com",
    };
    const createdProject = await projectService.createProject(data);
    const deletedProject = await projectService.deleteProject(createdProject._id);
    expect(deletedProject).not.toBeNull();

    // Confirm deletion by trying to retrieve the project
    const shouldBeNull = await projectService.getProjectById(createdProject._id);
    expect(shouldBeNull).toBeNull();
  });
});
