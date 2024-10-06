import bcrypt from "bcrypt";

export const hashedPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    return hashPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePasword = async (password, hashPassword) => {
  try {
    const match = await bcrypt.compare(password, hashPassword);
    return match;
  } catch (error) {
    console.log(error);
  }
};
