const AuthenticationSystem = artifacts.require("AuthenticationSystem");

contract("AuthenticationSystem", accounts => {
  let authenticationSystem;
  const owner = accounts[0];
  const user1 = accounts[1];
  const user2 = accounts[2];

  beforeEach(async () => {
    authenticationSystem = await AuthenticationSystem.new({ from: owner });
  });

  describe("User Registration", () => {
    it("should register a new user successfully", async () => {
      const username = "testuser";
      const email = "test@example.com";
      const publicKey = "0x1234567890abcdef";

      await authenticationSystem.registerUser(username, email, publicKey, { from: user1 });

      const isRegistered = await authenticationSystem.isRegistered(user1);
      assert.isTrue(isRegistered, "User should be registered");

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.equal(userInfo.username, username, "Username should match");
      assert.equal(userInfo.email, email, "Email should match");
      assert.equal(userInfo.publicKey, publicKey, "Public key should match");
      assert.isTrue(userInfo.isActive, "User should be active");
    });

    it("should not allow duplicate usernames", async () => {
      const username = "testuser";
      const email1 = "test1@example.com";
      const email2 = "test2@example.com";

      await authenticationSystem.registerUser(username, email1, "", { from: user1 });

      try {
        await authenticationSystem.registerUser(username, email2, "", { from: user2 });
        assert.fail("Should not allow duplicate username");
      } catch (error) {
        assert.include(error.message, "Username already taken");
      }
    });

    it("should not allow duplicate emails", async () => {
      const username1 = "user1";
      const username2 = "user2";
      const email = "test@example.com";

      await authenticationSystem.registerUser(username1, email, "", { from: user1 });

      try {
        await authenticationSystem.registerUser(username2, email, "", { from: user2 });
        assert.fail("Should not allow duplicate email");
      } catch (error) {
        assert.include(error.message, "Email already taken");
      }
    });

    it("should not allow empty username", async () => {
      const email = "test@example.com";

      try {
        await authenticationSystem.registerUser("", email, "", { from: user1 });
        assert.fail("Should not allow empty username");
      } catch (error) {
        assert.include(error.message, "Username cannot be empty");
      }
    });

    it("should not allow empty email", async () => {
      const username = "testuser";

      try {
        await authenticationSystem.registerUser(username, "", "", { from: user1 });
        assert.fail("Should not allow empty email");
      } catch (error) {
        assert.include(error.message, "Email cannot be empty");
      }
    });

    it("should not allow already registered user to register again", async () => {
      const username = "testuser";
      const email = "test@example.com";

      await authenticationSystem.registerUser(username, email, "", { from: user1 });

      try {
        await authenticationSystem.registerUser("newuser", "new@example.com", "", { from: user1 });
        assert.fail("Should not allow already registered user to register again");
      } catch (error) {
        assert.include(error.message, "User already registered");
      }
    });
  });

  describe("User Login", () => {
    beforeEach(async () => {
      await authenticationSystem.registerUser("testuser", "test@example.com", "", { from: user1 });
    });

    it("should allow registered user to login", async () => {
      const initialUserInfo = await authenticationSystem.getUserInfo(user1);
      const initialLastLogin = initialUserInfo.lastLogin;

      await authenticationSystem.login({ from: user1 });

      const updatedUserInfo = await authenticationSystem.getUserInfo(user1);
      assert.isTrue(updatedUserInfo.lastLogin > initialLastLogin, "Last login should be updated");
    });

    it("should not allow unregistered user to login", async () => {
      try {
        await authenticationSystem.login({ from: user2 });
        assert.fail("Should not allow unregistered user to login");
      } catch (error) {
        assert.include(error.message, "User not registered");
      }
    });

    it("should not allow deactivated user to login", async () => {
      await authenticationSystem.deactivateUser(user1, { from: user1 });

      try {
        await authenticationSystem.login({ from: user1 });
        assert.fail("Should not allow deactivated user to login");
      } catch (error) {
        assert.include(error.message, "User account is deactivated");
      }
    });
  });

  describe("User Information Updates", () => {
    beforeEach(async () => {
      await authenticationSystem.registerUser("testuser", "test@example.com", "oldkey", { from: user1 });
    });

    it("should allow user to update username", async () => {
      const newUsername = "newusername";

      await authenticationSystem.updateUserInfo(newUsername, "", "", { from: user1 });

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.equal(userInfo.username, newUsername, "Username should be updated");
    });

    it("should allow user to update email", async () => {
      const newEmail = "new@example.com";

      await authenticationSystem.updateUserInfo("", newEmail, "", { from: user1 });

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.equal(userInfo.email, newEmail, "Email should be updated");
    });

    it("should allow user to update public key", async () => {
      const newPublicKey = "newkey123";

      await authenticationSystem.updateUserInfo("", "", newPublicKey, { from: user1 });

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.equal(userInfo.publicKey, newPublicKey, "Public key should be updated");
    });

    it("should not allow updating to already taken username", async () => {
      await authenticationSystem.registerUser("user2", "user2@example.com", "", { from: user2 });

      try {
        await authenticationSystem.updateUserInfo("user2", "", "", { from: user1 });
        assert.fail("Should not allow updating to already taken username");
      } catch (error) {
        assert.include(error.message, "Username already taken");
      }
    });

    it("should not allow updating to already taken email", async () => {
      await authenticationSystem.registerUser("user2", "user2@example.com", "", { from: user2 });

      try {
        await authenticationSystem.updateUserInfo("", "user2@example.com", "", { from: user1 });
        assert.fail("Should not allow updating to already taken email");
      } catch (error) {
        assert.include(error.message, "Email already taken");
      }
    });
  });

  describe("Account Management", () => {
    beforeEach(async () => {
      await authenticationSystem.registerUser("testuser", "test@example.com", "", { from: user1 });
    });

    it("should allow user to deactivate their own account", async () => {
      await authenticationSystem.deactivateUser(user1, { from: user1 });

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.isFalse(userInfo.isActive, "User should be deactivated");
    });

    it("should allow owner to deactivate any user account", async () => {
      await authenticationSystem.deactivateUser(user1, { from: owner });

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.isFalse(userInfo.isActive, "User should be deactivated");
    });

    it("should not allow non-owner to deactivate other user account", async () => {
      await authenticationSystem.registerUser("user2", "user2@example.com", "", { from: user2 });

      try {
        await authenticationSystem.deactivateUser(user1, { from: user2 });
        assert.fail("Should not allow non-owner to deactivate other user account");
      } catch (error) {
        assert.include(error.message, "Only owner or user can deactivate account");
      }
    });

    it("should allow owner to reactivate deactivated account", async () => {
      await authenticationSystem.deactivateUser(user1, { from: user1 });
      await authenticationSystem.reactivateUser(user1, { from: owner });

      const userInfo = await authenticationSystem.getUserInfo(user1);
      assert.isTrue(userInfo.isActive, "User should be reactivated");
    });

    it("should not allow non-owner to reactivate account", async () => {
      await authenticationSystem.deactivateUser(user1, { from: user1 });

      try {
        await authenticationSystem.reactivateUser(user1, { from: user2 });
        assert.fail("Should not allow non-owner to reactivate account");
      } catch (error) {
        assert.include(error.message, "Ownable: caller is not the owner");
      }
    });
  });

  describe("View Functions", () => {
    beforeEach(async () => {
      await authenticationSystem.registerUser("testuser", "test@example.com", "testkey", { from: user1 });
    });

    it("should return correct user information", async () => {
      const userInfo = await authenticationSystem.getUserInfo(user1);

      assert.equal(userInfo.username, "testuser", "Username should be correct");
      assert.equal(userInfo.email, "test@example.com", "Email should be correct");
      assert.equal(userInfo.publicKey, "testkey", "Public key should be correct");
      assert.isTrue(userInfo.isActive, "User should be active");
      assert.isTrue(userInfo.registrationDate > 0, "Registration date should be set");
    });

    it("should return correct active status", async () => {
      const isActive = await authenticationSystem.isUserActive(user1);
      assert.isTrue(isActive, "User should be active");

      await authenticationSystem.deactivateUser(user1, { from: user1 });
      const isActiveAfterDeactivation = await authenticationSystem.isUserActive(user1);
      assert.isFalse(isActiveAfterDeactivation, "User should not be active after deactivation");
    });

    it("should return correct registration status", async () => {
      const isRegistered = await authenticationSystem.isRegistered(user1);
      assert.isTrue(isRegistered, "User should be registered");

      const isNotRegistered = await authenticationSystem.isRegistered(user2);
      assert.isFalse(isNotRegistered, "User should not be registered");
    });
  });

  describe("Events", () => {
    it("should emit UserRegistered event on registration", async () => {
      const username = "testuser";
      const email = "test@example.com";
      const publicKey = "testkey";

      const tx = await authenticationSystem.registerUser(username, email, publicKey, { from: user1 });

      assert.equal(tx.logs.length, 1, "Should emit one event");
      assert.equal(tx.logs[0].event, "UserRegistered", "Should emit UserRegistered event");
      assert.equal(tx.logs[0].args.userAddress, user1, "User address should match");
      assert.equal(tx.logs[0].args.username, username, "Username should match");
      assert.equal(tx.logs[0].args.email, email, "Email should match");
    });

    it("should emit UserLoggedIn event on login", async () => {
      await authenticationSystem.registerUser("testuser", "test@example.com", "", { from: user1 });

      const tx = await authenticationSystem.login({ from: user1 });

      assert.equal(tx.logs.length, 1, "Should emit one event");
      assert.equal(tx.logs[0].event, "UserLoggedIn", "Should emit UserLoggedIn event");
      assert.equal(tx.logs[0].args.userAddress, user1, "User address should match");
    });

    it("should emit UserUpdated event on profile update", async () => {
      await authenticationSystem.registerUser("testuser", "test@example.com", "", { from: user1 });

      const tx = await authenticationSystem.updateUserInfo("newuser", "new@example.com", "newkey", { from: user1 });

      assert.equal(tx.logs.length, 1, "Should emit one event");
      assert.equal(tx.logs[0].event, "UserUpdated", "Should emit UserUpdated event");
      assert.equal(tx.logs[0].args.userAddress, user1, "User address should match");
    });
  });
});
