const getDataCheckSession = async (url) => {
  try {
    const MyCookies = document.cookie;

    if (MyCookies.includes("jwttokenFront=")) {
      const jwttoken = MyCookies.split("; ")
        .find((x) => x.startsWith("jwttokenFront="))
        .split("=")[1];

      const response = await fetch("https://nikfior-back-end.herokuapp.com/login/success", {
        headers: {
          "Custom-Authorization": jwttoken,
        },
      });

      const data = await response.json();
      if (data.msg === "Success") {
        // If no arguments, return the check result
        if (url === undefined) {
          return data;
        }
        const response2 = await fetch(url, {
          headers: {
            "Custom-Authorization": jwttoken,
          },
        });

        const data2 = await response2.json();
        return data2;
      }

      // wrong token so clear cookie
      document.cookie = "jwttokenFront=; expires=Thu, 01 Jan 1970 00:00:01 UTC";
      throw new Error("Credentials missing");
    }

    // no jwttoken cookie
    throw new Error("Credentials missing");

    //
  } catch (error) {
    // if (error.message === "Credentials missing") {
    //   //   navigate("/");
    // } else {
    throw error;
    // }
  }

  //
};

export default getDataCheckSession;
