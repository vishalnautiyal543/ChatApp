import { User } from "../models/user.model.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    //check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    //hash password -> humne pre event use kiya h user model me

    //avatar
    const avatarFile = req.files?.avatar[0].path;

    //create user

    const user = await User.create({
        name,
        email,
        password,
        avatar:avatarFile
    })

     // Response
    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
    


  } catch (error) {
     console.error(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};


//login

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
        console.error(error);

        return res.status(500).json({
        message: "Internal server error",
        });
  }
};

export { registerUser,login };
