/* eslint-disable @next/next/no-img-element */
"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useGetContextSession from "@/hooks/useGetDataSession";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db, functions, realtimeDb, storage } from "@/lib/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { onValue, ref as refDb } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export default function Home() {
  const { user } = useGetContextSession();
  const [dataFirestore, setDataFirestore] = useState<any[]>([]);
  const [dataRealtimeDb, setDataRealtimeDb] = useState<any[]>([]);
  const [callableFunctionOk, setCallableFunctionOk] = useState<boolean | null>(
    null
  );
  const [httpRequestFunctionOk, setHttpRequestFunctionOk] = useState<
    boolean | null
  >(null);
  const [thirdBackendOk, setThirdBackendOk] = useState<boolean | null>(null);
  const [urlImage, setUrlImage] = useState<string | null>(null);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      password: "",
      email: "",
    },
  });
  const onSubmit = (data: any) => {
    const { email, password } = data;
    console.log("data", data);
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;

        const errorMessage = error.message;
        alert(errorMessage);
      });
  };
  const logout = async () => {
    try {
      await auth.signOut();
    } catch (error) {}
  };
  const getDataFirestore = async () => {
    try {
      const docRef = doc(db, "data-firestore", "testing");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setDataFirestore([docSnap.data()]);
        console.log("Document data:");
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
        setDataFirestore(["errror"]);
      }
    } catch (error) {
      console.log("error firestore", error);
      setDataFirestore([error.code]);
    }
  };
  const getURLImage = async () => {
    try {
      const starsRef = ref(storage, "Python-logo-notext.svg.png");
      // Get the download URL
      getDownloadURL(starsRef)
        .then((url) => {
          // Insert url into an <img> tag to "download"
          setUrlImage(url);
        })
        .catch((error) => {
          // setUrlImage(null);
          setUrlImage("error_image");
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              alert("File doesn't exist");
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              alert("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              // User canceled the upload
              alert("User canceled the upload");
              break;

            // ...

            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              alert("Unknown error occurred, inspect the server response");
              break;
          }
        });
    } catch (error) {
      console.log("error", error);
      setUrlImage("error_image");
    }
  };
  const getDbRealtime = async () => {
    try {
      const starCountRef = refDb(realtimeDb, "testing");
      onValue(starCountRef, (snapshot) => {
        const data = snapshot.val();
        setDataRealtimeDb([data]);
      });
    } catch (error) {
      console.log("error realtime", error);
      setDataRealtimeDb([error.code]);
    }
  };

  const TestCloudFunctionCallable = async () => {
    const addMessage = httpsCallable(functions, "callableFunctions");
    console.log("addMessage", addMessage);
    await addMessage()
      .then((result) => {
        console.log("result", result);
        const data = result.data;
        console.log("data", data);
        setCallableFunctionOk(true);
      })
      .catch((error) => {
        console.log("error", error);
        setCallableFunctionOk(false);
      });
  };
  const testHttpRequestFunction = async () => {
    try {
      const url = "https://helloworld-654zlv26wa-uc.a.run.app";
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setHttpRequestFunctionOk(true);
    } catch (error) {
      setHttpRequestFunctionOk(false);
      console.log("error", error);
    }
  };
  const testThirdBackend = async () => {
    try {
      const url = "https://thirdbackend-654zlv26wa-uc.a.run.app";
      const response = await fetch(url);
      const data = await response.json();
      console.log("data", data);
      setThirdBackendOk(true);
    } catch (error) {
      setThirdBackendOk(false);
      console.log("error", error);
    }
  };

  useEffect(() => {
    getDataFirestore();
    getURLImage();
    getDbRealtime();
  }, []);
  console.log("user", user);
  return (
    <div>
      <h1>Autentication: {JSON.stringify(user)}</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} />
        <input {...register("password")} />
        <button type="submit">Login</button>
      </form>
      <button onClick={logout}>Logout</button>
      <h1>Firestore</h1>
      <div>{JSON.stringify(dataFirestore)}</div>
      <h1>Realtime Database</h1>
      <div>{JSON.stringify(dataRealtimeDb)}</div>
      <h1>Firestorage</h1>
      {urlImage &&
        (urlImage === "error_image" ? (
          "ERROR IMAGE"
        ) : (
          <img src={urlImage} alt="d" width={100} height={100} />
        ))}
      <h1>
        Cloud function Callable :{" "}
        {callableFunctionOk
          ? "ok"
          : typeof callableFunctionOk === "boolean"
          ? "No ok"
          : ""}
      </h1>
      <button onClick={TestCloudFunctionCallable}>Callable Function</button>
      <h1>
        Cloud function Request :{" "}
        {httpRequestFunctionOk
          ? "ok"
          : typeof httpRequestFunctionOk === "boolean"
          ? "No ok"
          : ""}
      </h1>
      <button onClick={testHttpRequestFunction}>Request Function</button>
      <h1>
        Third backend{" "}
        {thirdBackendOk
          ? "ok"
          : typeof thirdBackendOk === "boolean"
          ? "No ok"
          : ""}
      </h1>
      <button onClick={testThirdBackend}>Third backend </button>
    </div>
  );
}
