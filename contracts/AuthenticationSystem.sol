// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title AuthenticationSystem
 * @dev A blockchain-based authentication system that replaces traditional username-password authentication
 * with wallet-based authentication using Ethereum addresses as unique identifiers.
 */
contract AuthenticationSystem is Ownable, ReentrancyGuard {
    
    // Struct to store user information
    struct User {
        string username;
        string email;
        uint256 registrationDate;
        bool isActive;
        uint256 lastLogin;
        string publicKey;
    }
    
    // Mapping from Ethereum address to User struct
    mapping(address => User) public users;
    
    // Mapping to check if an address is registered
    mapping(address => bool) public isRegistered;
    
    // Mapping to check if username is taken
    mapping(string => bool) public usernameTaken;
    
    // Mapping to check if email is taken
    mapping(string => bool) public emailTaken;
    
    // Events
    event UserRegistered(address indexed userAddress, string username, string email, uint256 timestamp);
    event UserLoggedIn(address indexed userAddress, uint256 timestamp);
    event UserUpdated(address indexed userAddress, string username, string email, uint256 timestamp);
    event UserDeactivated(address indexed userAddress, uint256 timestamp);
    event UserReactivated(address indexed userAddress, uint256 timestamp);
    
    // Modifiers
    modifier onlyRegistered() {
        require(isRegistered[msg.sender], "User not registered");
        require(users[msg.sender].isActive, "User account is deactivated");
        _;
    }
    
    modifier onlyUnregistered() {
        require(!isRegistered[msg.sender], "User already registered");
        _;
    }
    
    /**
     * @dev Register a new user with their Ethereum address
     * @param _username The username for the account
     * @param _email The email address for the account
     * @param _publicKey The public key for additional security
     */
    function registerUser(
        string memory _username,
        string memory _email,
        string memory _publicKey
    ) external onlyUnregistered nonReentrant {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(bytes(_email).length > 0, "Email cannot be empty");
        require(!usernameTaken[_username], "Username already taken");
        require(!emailTaken[_email], "Email already taken");
        
        // Create new user
        users[msg.sender] = User({
            username: _username,
            email: _email,
            registrationDate: block.timestamp,
            isActive: true,
            lastLogin: 0,
            publicKey: _publicKey
        });
        
        // Update mappings
        isRegistered[msg.sender] = true;
        usernameTaken[_username] = true;
        emailTaken[_email] = true;
        
        emit UserRegistered(msg.sender, _username, _email, block.timestamp);
    }
    
    /**
     * @dev Login function - updates last login timestamp
     */
    function login() external onlyRegistered {
        users[msg.sender].lastLogin = block.timestamp;
        emit UserLoggedIn(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update user information
     * @param _newUsername New username (optional, pass empty string to keep current)
     * @param _newEmail New email (optional, pass empty string to keep current)
     * @param _newPublicKey New public key (optional, pass empty string to keep current)
     */
    function updateUserInfo(
        string memory _newUsername,
        string memory _newEmail,
        string memory _newPublicKey
    ) external onlyRegistered nonReentrant {
        User storage user = users[msg.sender];
        
        // Update username if provided and different
        if (bytes(_newUsername).length > 0 && keccak256(bytes(_newUsername)) != keccak256(bytes(user.username))) {
            require(!usernameTaken[_newUsername], "Username already taken");
            usernameTaken[user.username] = false; // Free up old username
            user.username = _newUsername;
            usernameTaken[_newUsername] = true;
        }
        
        // Update email if provided and different
        if (bytes(_newEmail).length > 0 && keccak256(bytes(_newEmail)) != keccak256(bytes(user.email))) {
            require(!emailTaken[_newEmail], "Email already taken");
            emailTaken[user.email] = false; // Free up old email
            user.email = _newEmail;
            emailTaken[_newEmail] = true;
        }
        
        // Update public key if provided
        if (bytes(_newPublicKey).length > 0) {
            user.publicKey = _newPublicKey;
        }
        
        emit UserUpdated(msg.sender, user.username, user.email, block.timestamp);
    }
    
    /**
     * @dev Deactivate user account (only owner or user themselves)
     * @param _userAddress Address of user to deactivate
     */
    function deactivateUser(address _userAddress) external {
        require(
            msg.sender == owner() || msg.sender == _userAddress,
            "Only owner or user can deactivate account"
        );
        require(isRegistered[_userAddress], "User not registered");
        require(users[_userAddress].isActive, "User already deactivated");
        
        users[_userAddress].isActive = false;
        emit UserDeactivated(_userAddress, block.timestamp);
    }
    
    /**
     * @dev Reactivate user account (only owner)
     * @param _userAddress Address of user to reactivate
     */
    function reactivateUser(address _userAddress) external onlyOwner {
        require(isRegistered[_userAddress], "User not registered");
        require(!users[_userAddress].isActive, "User already active");
        
        users[_userAddress].isActive = true;
        emit UserReactivated(_userAddress, block.timestamp);
    }
    
    /**
     * @dev Get user information
     * @param _userAddress Address of the user
     * @return User struct with all user information
     */
    function getUserInfo(address _userAddress) external view returns (User memory) {
        require(isRegistered[_userAddress], "User not registered");
        return users[_userAddress];
    }
    
    /**
     * @dev Check if user is registered and active
     * @param _userAddress Address of the user
     * @return bool True if user is registered and active
     */
    function isUserActive(address _userAddress) external view returns (bool) {
        return isRegistered[_userAddress] && users[_userAddress].isActive;
    }
    
    /**
     * @dev Get total number of registered users (only owner)
     * @return uint256 Total number of registered users
     */
    function getTotalUsers() external view onlyOwner returns (uint256) {
        // This is a simplified implementation
        // In a production system, you might want to maintain a counter
        return 0; // Placeholder
    }
}
