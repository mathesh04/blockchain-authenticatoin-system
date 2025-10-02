const AuthenticationSystem = artifacts.require("AuthenticationSystem");

module.exports = function(deployer) {
  deployer.deploy(AuthenticationSystem);
};
