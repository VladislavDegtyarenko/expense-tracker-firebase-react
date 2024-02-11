const useGetUserInfo = () => {
  const savedAuthJSON = localStorage.getItem("auth");

  if (savedAuthJSON) {
    const { name, profilePhoto, userID, isAuth } = JSON.parse(savedAuthJSON);

    return { name, profilePhoto, userID, isAuth };
  }

  return {
    name: "",
    profilePhoto: "",
    userID: "",
    isAuth: false,
  };
};

export default useGetUserInfo;
