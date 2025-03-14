/* eslint-disable @typescript-eslint/no-unused-expressions */
import { expect } from "chai";
import * as sinon from "sinon";
import { faker } from "@faker-js/faker";
import { LoginUserUseCase } from "../src/geo-app/application/use-case/user/login-user.use-case";
import { User } from "../src/geo-app/domain/entity/user.entity";
import { GetUserUseCase } from "../src/geo-app/application/use-case/user/get-user.use-case";
import { CreateUserUseCase } from "../src/geo-app/application/use-case/user/create-user.use-case";

describe("LoginUserUseCase", () => {
  let loginUserUseCase;
  let getUserByEmailRepositoryStub;
  let authProviderStub;

  beforeEach(() => {
    getUserByEmailRepositoryStub = {
      execute: sinon.stub(),
    };

    authProviderStub = {
      tokenize: sinon.stub(),
    };

    loginUserUseCase = new LoginUserUseCase(
      getUserByEmailRepositoryStub,
      authProviderStub,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return a token after email match", async () => {
    const user = new User(
      faker.string.uuid(),
      faker.person.fullName(),
      faker.internet.email(),
    );
    const fakeToken = faker.string.uuid();

    getUserByEmailRepositoryStub.execute.resolves(user);
    authProviderStub.tokenize.returns(fakeToken);

    const result = await loginUserUseCase.execute(user.email);

    expect(getUserByEmailRepositoryStub.execute.calledWith(user.email)).to.be
      .true;
    expect(authProviderStub.tokenize.calledWith(user.id)).to.be.true;
    expect(result).to.equal(fakeToken);
  });

  it("should return null after email doesn't match", async () => {
    getUserByEmailRepositoryStub.execute.resolves(null);

    const result = await loginUserUseCase.execute(faker.internet.email());

    expect(getUserByEmailRepositoryStub.execute.called).to.be.true;
    expect(authProviderStub.tokenize.called).to.be.false;
    expect(result).to.be.null;
  });
});

describe("GetUserUseCase", () => {
  let getUserUseCase;
  let getUserRepositoryStub;

  beforeEach(() => {
    getUserRepositoryStub = {
      execute: sinon.stub(),
    };

    getUserUseCase = new GetUserUseCase(getUserRepositoryStub);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should return a user when found", async () => {
    const userId = faker.string.uuid();
    const tenantId = faker.string.uuid();
    const expectedUser = new User(
      userId,
      faker.person.fullName(),
      faker.internet.email(),
    );

    getUserRepositoryStub.execute.resolves(expectedUser);

    const result = await getUserUseCase.execute(userId, tenantId);

    expect(getUserRepositoryStub.execute.calledWith(userId, tenantId)).to.be
      .true;

    expect(result).to.equal(expectedUser);
  });

  it("should return null when user is not found", async () => {
    const userId = faker.string.uuid();
    const tenantId = faker.string.uuid();
    getUserRepositoryStub.execute.resolves(null);

    const result = await getUserUseCase.execute(userId, tenantId);

    expect(getUserRepositoryStub.execute.calledWith(userId, tenantId)).to.be
      .true;

    expect(result).to.be.null;
  });
});

describe("CreateUserUseCase", () => {
  let createUserRepositoryStub,
    geoLibStub,
    userMapperStub,
    authProviderStub,
    createUserUseCase;

  beforeEach(() => {
    createUserRepositoryStub = { execute: sinon.stub() };
    geoLibStub = {
      getCoordinatesFromAddress: sinon.stub(),
      getAddressFromCoordinates: sinon.stub(),
    };
    userMapperStub = {
      toEntity: sinon.stub(),
      toDTO: sinon.stub(),
    };
    authProviderStub = { tokenize: sinon.stub() };

    createUserUseCase = new CreateUserUseCase(
      createUserRepositoryStub,
      geoLibStub,
      userMapperStub,
      authProviderStub,
    );
  });

  it("should convert address to coordinates if only address is provided", async () => {
    const userData = { address: faker.location.streetAddress() };
    const mockCoordinates = {
      lng: faker.location.longitude(),
      lat: faker.location.latitude(),
    };
    const userEntity = {
      ...userData,
      coordinates: [mockCoordinates.lng, mockCoordinates.lat],
    };
    const createdUser = { id: faker.string.uuid() };
    const token = faker.string.uuid();

    userMapperStub.toEntity.returns(userEntity);
    geoLibStub.getCoordinatesFromAddress.resolves(mockCoordinates);
    createUserRepositoryStub.execute.resolves(createdUser);
    authProviderStub.tokenize.returns(token);
    userMapperStub.toDTO.returns(createdUser);

    const result = await createUserUseCase.execute(userData);

    expect(geoLibStub.getCoordinatesFromAddress.calledWith(userData.address)).to
      .be.true;
    expect(createUserRepositoryStub.execute.calledWith(userEntity)).to.be.true;
    expect(result).to.deep.equal({ user: createdUser, token });
  });

  it("should convert coordinates to address if only coordinates are provided", async () => {
    const userData = {
      coordinates: [faker.location.longitude(), faker.location.latitude()],
    };
    const mockAddress = faker.location.streetAddress();
    const userEntity = { ...userData, address: mockAddress };
    const createdUser = { id: faker.string.uuid() };
    const token = faker.string.uuid();

    userMapperStub.toEntity.returns(userEntity);
    geoLibStub.getAddressFromCoordinates.resolves(mockAddress);
    createUserRepositoryStub.execute.resolves(createdUser);
    authProviderStub.tokenize.returns(token);
    userMapperStub.toDTO.returns(createdUser);

    const result = await createUserUseCase.execute(userData);

    expect(
      geoLibStub.getAddressFromCoordinates.calledWith(userData.coordinates),
    ).to.be.true;
    expect(createUserRepositoryStub.execute.calledWith(userEntity)).to.be.true;
    expect(result).to.deep.equal({ user: createdUser, token });
  });
});
