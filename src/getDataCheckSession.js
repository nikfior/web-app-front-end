const getDataCheckSession = async (url, method = "GET", body) => {
  try {
    const MyCookies = document.cookie;

    if (MyCookies.includes("jwttokenFront=")) {
      const jwttoken = MyCookies.split("; ")
        .find((x) => x.startsWith("jwttokenFront="))
        .split("=")[1];

      // check if logged and verify user
      const response = await fetch(`${process.env.REACT_APP_BACKEND}login/success`, {
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
        // -----

        let response2;
        if (!body) {
          response2 = await fetch(url, {
            method: method,
            headers: {
              "Custom-Authorization": jwttoken,
            },
          });
        } else {
          response2 = await fetch(url, {
            method: method,
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Custom-Authorization": jwttoken,
            },
            body: JSON.stringify(body),
          });
        }

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
