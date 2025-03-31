import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

export async function createUser(req, res) {

    const newUserData = req.body;

    if(newUserData.type == "admin") {

        if(req.user == null) {
            res.json({
                message: "Please login as administrator to create admin accounts"
            });
            return;
        }

        if(req.user.type != "admin") {
            res.json({
                message: "Please login as administrator to create admin accounts"
            });
            return;
        }
    }

    newUserData.password = await bcrypt.hash(newUserData.password, 10);

    const user = new User(newUserData);

    try {
        await user.save();
        res.json({
            message: "User created"
        })
    } catch (error) {
        res.json({
            message: "User not created"
        })
    }
}

export async function loginUser(req, res) {

    try {
        const users = await User.find({email: req.body.email});

        if(users.length == 0) {
            res.json({
                message: "User not found"
            })
        } else {
            const user = users[0];

            const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

            if(isPasswordCorrect) {
                const token = jwt.sign({
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isBlocked: user.isBlocked,
                    type: user.type,
                    profilePicture: user.profilePicture
                }, process.env.SECRET); 
                
                res.json({
                    message: "User logged in",
                    token: token,
                    user: {
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isBlocked: user.isBlocked,
                        type: user.type,
                        profilePicture: user.profilePicture
                    }
                })
            } else {
                res.json({
                    message: "User not logged in (wrong password)"
                })
            }
        }
    } catch (error) {
        res.json({
            message: "User not logged in"
        })
    }
}

export function isAdmin(req) {
    if(req.user == null) {
        return false;
    }

    if(req.user.type != "admin") {
        return false;
    }

    return true;
}

export function isCustomer(req) {
    if(req.user == null) {
        return false;
    }

    if(req.user.type != "customer") {
        return false;
    }

    return true;
}

export async function googleCreateUser(req, res) {
    console.log(req.body);
    const token = req.body.token;
  
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
  
        const email = response.data.email;
  
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
  
        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists. Please log in."
            });
        }
  
        // Create new user
        const newUser = new User({
            email: email,
            firstName: response.data.given_name,
            lastName: response.data.family_name,
            type: "customer",
            password: "google-auth",
            profilePicture: response.data.picture
        });
  
        await newUser.save();
  
        res.status(201).json({
            message: "User created",
            redirect: "/login" // Frontend can use this for redirection
        });
  
    } catch (e) {
        console.error("Google signup error:", e);
        res.status(500).json({
            message: "Google signup failed"
        });
    }
}

export async function googleLoginUser(req, res) {
  console.log(req.body);
  const token = req.body.token;

  try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
              Authorization: `Bearer ${token}`
          }
      });

      const email = response.data.email;

      // Check if user exists
      const user = await User.findOne({ email: email });

      if (user) {
          // Generate JWT token
          const token = jwt.sign(
              {
                  email: user.email,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  isBlocked: user.isBlocked,
                  type: user.type,
                  profilePicture: user.profilePicture
              },
              process.env.SECRET
          );

          res.json({
              message: "User logged in",
              token: token,
              user: {
                  firstName: user.firstName,
                  lastName: user.lastName,
                  type: user.type,
                  profilePicture: user.profilePicture,
                  email: user.email
              }
          });
      } else {
          res.status(401).json({
              message: "Google login failed. Please sign up first."
          });
      }
  } catch (e) {
      console.error("Google login error:", e);
      res.status(500).json({
          message: "Google login failed"
      });
    }
}

  export async function getUser(req,res){
    if(req.user == null) {
      res.status(404).json({
          message: "Please login to view user details"
      })
      return;
    }

    res.json(req.user)
  }
  
  export async function getUsers(req, res) {
    try {
      const users = await User.find(); 
      res.json(users);
    } catch (err) {
      res.status(500).json({
        message: "Error retrieving users",
        error: err.message
      });
    }
  }

  export async function deleteUser(req, res) {
    if (!isAdmin(req)) {
        res.status(403).json({
            message: "Please login as administrator to delete users"
        });
        return;
    }

    const email = req.params.email;

    try {
        await User.deleteOne({ email: email });
        res.json({
            message: "User deleted"
        });
    } catch (error) {
        res.status(403).json({
            message: error
        });
    }
}
  


