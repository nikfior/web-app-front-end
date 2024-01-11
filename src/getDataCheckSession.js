const getDataCheckSession = async (url, method = "GET", timeout = 60000, body) => {
  try {
    const MyCookies = document.cookie;

    if (MyCookies.includes("jwttokenFront=")) {
      const jwttoken = MyCookies.split("; ")
        .find((x) => x.startsWith("jwttokenFront="))
        .split("=")[1];

      const controller = new AbortController();
      const signal = controller.signal;
      let timer = setTimeout(() => controller.abort(), timeout);

      // console.log("Before response");
      // check if logged and verify user
      const response = await fetch(`${process.env.REACT_APP_BACKEND}login/success`, {
        signal,
        headers: {
          "Custom-Authorization": jwttoken,
        },
      });

      clearTimeout(timer);
      // console.log("after response");
      const data = await response.json();
      if (data.msg === "Success") {
        // If no arguments, return the check result
        if (url === undefined) {
          return data;
        }
        // -----

        timer = setTimeout(() => controller.abort(), timeout);
        let response2;
        if (!body) {
          response2 = await fetch(url, {
            signal,
            method: method,
            headers: {
              "Custom-Authorization": jwttoken,
            },
          });
        } else {
          response2 = await fetch(url, {
            signal,
            method: method,
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              "Custom-Authorization": jwttoken,
            },
            body: JSON.stringify(body),
          });
        }

        clearTimeout(timer);
        const data2 = await response2.json();
        return data2;
      }

      // wrong token so clear cookie
      document.cookie = "jwttokenFront=; expires=Thu, 01 Jan 1970 00:00:01 UTC; path=/;";
      throw new Error("Credentials missing");
    }

    // no jwttoken cookie
    throw new Error("Credentials missing");

    //
  } catch (error) {
    // console.log("In Error: " + error.message);
    // if (error.message === "Credentials missing") {
    //   //   navigate("/");
    // } else {
    throw error;
    // }
  }

  //
};

export default getDataCheckSession;
