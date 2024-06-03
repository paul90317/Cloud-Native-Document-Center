const db = require('../../models');
const dbHelper = require('../../util/dbHelper');

jest.mock('../../models', () => ({
  sequelize: {
    models: {
      users: {
        findOne: jest.fn()
      },
      documents: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        destroy: jest.fn()
      },
      roles: {
        findOne: jest.fn(),
        findAll: jest.fn(),
        create: jest.fn(),
        destroy: jest.fn()
      },
      logs: {
        create: jest.fn()
      }
    }
  }
}));

describe('dbHelper tests', () => {
  it('should find a user by email', async () => {
    const mockEmail = "test@example.com";
    const mockUser = { id: 1, email: mockEmail };

    db.sequelize.models.users.findOne.mockResolvedValue(mockUser);

    const user = await dbHelper.findUserByEmail(mockEmail);

    expect(user).toEqual(mockUser);
    expect(db.sequelize.models.users.findOne).toHaveBeenCalledWith({
      where: { email: mockEmail }
    });
  });

  it('should find a user by account', async () => {
    const mockAccount = "test";
    const mockUser = { id: 1, account: mockAccount };

    db.sequelize.models.users.findOne.mockResolvedValue(mockUser);

    const user = await dbHelper.findUserByAccount(mockAccount);

    expect(user).toEqual(mockUser);
    expect(db.sequelize.models.users.findOne).toHaveBeenCalledWith({
      where: { account: mockAccount }
    });
  });

  it('should find a document by id', async () => {
    const mockId = 1;
    const mockDocument = { id: mockId };

    db.sequelize.models.documents.findOne.mockResolvedValue(mockDocument);

    const document = await dbHelper.findDocumentById(mockId);

    expect(document).toEqual(mockDocument);
    expect(db.sequelize.models.documents.findOne).toHaveBeenCalledWith({
      where: { id: mockId }
    });
  });

  it('should find documents by user', async () => {
    const mockAccount = "test";
    const mockDocuments = [{ id: 1 }, { id: 2 }];

    db.sequelize.models.documents.findAll.mockResolvedValue(mockDocuments);

    const documents = await dbHelper.findDocumentByUser(mockAccount);

    expect(documents).toEqual(mockDocuments);
    expect(db.sequelize.models.documents.findAll).toHaveBeenCalledWith({
      where: { creator: mockAccount }
    });
  });

  it('should find a document by name', async () => {
    const mockName = "test";
    const mockDocument = { id: 1, name: mockName };

    db.sequelize.models.documents.findOne.mockResolvedValue(mockDocument);

    const document = await dbHelper.findDocumentByName(mockName);

    expect(document).toEqual(mockDocument);
    expect(db.sequelize.models.documents.findOne).toHaveBeenCalledWith({
      where: { name: mockName }
    });
  });

  it('should find a document by user and name', async () => {
    const mockUser = "test";
    const mockName = "test";
    const mockDocument = { id: 1, creator: mockUser, name: mockName };

    db.sequelize.models.documents.findOne.mockResolvedValue(mockDocument);

    const document = await dbHelper.findDocumentByUserAndName(mockUser, mockName);

    expect(document).toEqual(mockDocument);
    expect(db.sequelize.models.documents.findOne).toHaveBeenCalledWith({
      where: { creator: mockUser, name: mockName }
    });
  });

  it('should find all documents', async () => {
    const mockDocuments = [{ id: 1 }, { id: 2 }];

    db.sequelize.models.documents.findAll.mockResolvedValue(mockDocuments);

    const documents = await dbHelper.findAllDocuments();

    expect(documents).toEqual(mockDocuments);
    expect(db.sequelize.models.documents.findAll).toHaveBeenCalled();
  });

  it('should create a document', async () => {
    const mockName = "test";
    const mockContent = "test";
    const mockCreator = "test";
    const mockStatus = "test";
    const mockDocument = { id: 1, name: mockName, content: mockContent, creator: mockCreator, status: mockStatus };

    db.sequelize.models.documents.create.mockResolvedValue(mockDocument);

    const document = await dbHelper.createDocument(mockName, mockContent, mockCreator, mockStatus);

    expect(document).toEqual(mockDocument);
    expect(db.sequelize.models.documents.create).toHaveBeenCalledWith({
      name: mockName,
      content: mockContent,
      creator: mockCreator,
      reviewer: mockCreator,
      status: mockStatus,
      message: ''
    });
  });

  it('should update a document', async () => {
    const mockId = 1;
    const mockContent = "test";
    const mockName = "test";

    db.sequelize.models.documents.update.mockResolvedValue();

    await dbHelper.updateDocument(mockId, mockContent, mockName);

    expect(db.sequelize.models.documents.update).toHaveBeenCalledWith(
      { content: mockContent, name: mockName },
      { where: { id: mockId } }
    );
  });

  it('should delete a document', async () => {
    const mockId = 1;

    db.sequelize.models.documents.destroy.mockResolvedValue();

    await dbHelper.deleteDocument(mockId);

    expect(db.sequelize.models.documents.destroy).toHaveBeenCalledWith({
      where: { id: mockId }
    });
  });

  it('should update a document name', async () => {
    const mockId = 1;
    const mockName = "test";

    db.sequelize.models.documents.update.mockResolvedValue();

    await dbHelper.updateDocumentName(mockId, mockName);

    expect(db.sequelize.models.documents.update).toHaveBeenCalledWith(
      { name: mockName },
      { where: { id: mockId } }
    );
  });

  it('should create a role', async () => {
    const mockDocument = 1;
    const mockUser = "test";
    const mockRole = "test";
    const mockRoleObj = { document: mockDocument, user: mockUser, role: mockRole };

    db.sequelize.models.roles.create.mockResolvedValue(mockRoleObj);

    const role = await dbHelper.createRole(mockDocument, mockUser, mockRole);

    expect(role).toEqual(mockRoleObj);
    expect(db.sequelize.models.roles.create).toHaveBeenCalledWith({
      document: mockDocument,
      user: mockUser,
      role: mockRole
    });
  });

  it('should delete a role', async () => {
    const mockDocument = 1;
    const mockUser = "test";

    db.sequelize.models.roles.destroy.mockResolvedValue();

    await dbHelper.deleteRole(mockDocument, mockUser);

    expect(db.sequelize.models.roles.destroy).toHaveBeenCalledWith({
      where: { document: mockDocument, user: mockUser }
    });
  });

  it('should find a role', async () => {
    const mockDocument = 1;
    const mockUser = "test";
    const mockRole = "test";
    const mockRoleObj = { document: mockDocument, user: mockUser, role: mockRole };

    db.sequelize.models.roles.findOne.mockResolvedValue(mockRoleObj);

    const role = await dbHelper.findRole(mockDocument, mockUser);

    expect(role).toEqual(mockRoleObj);
    expect(db.sequelize.models.roles.findOne).toHaveBeenCalledWith({
      where: { document: mockDocument, user: mockUser }
    });
  });
});

