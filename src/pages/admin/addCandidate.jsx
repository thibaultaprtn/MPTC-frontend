import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";

const AddCandidate = () => {
  const { userMongoId } = useContext(GlobalContext);
  const [body, setBody] = useState({
    name: "",
    description: "",
    performances: [],
  });

  const [pictures, setPictures] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsWaiting(true);
    try {
      const formData = new FormData();
      formData.append("name", body.name);
      formData.append("description", body.description);

      for (const pic of pictures) {
        console.log("pic", pic);
        formData.append("picture", pic);
      }

      // console.log("formData==>", formData);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKURL}/candidate/create`,
        formData,
        {
          headers: {
            Authorization: userMongoId,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      // navigate(`/offer/${response.data._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <p>Ajout d'un candidat</p>
        <form onSubmit={handleSubmit}>
          <label id="publishpicinput" htmlFor="picture-input">
            Ajoute ta photo
          </label>
          <input
            id="picture-input"
            style={{ flexShrink: 0, display: "none" }}
            type="file"
            multiple="multiple"
            onChange={(event) => {
              // console.log(
              //   "type of event.target.files",
              //   typeof event.target.files
              // );
              // console.log(
              //   "est ce que event.target.files est un tableau ?",
              //   Array.isArray(event.target.files)
              // );
              // console.log(event.target.files);
              // console.log(event.target.files);
              // console.log(event.target.files[0]);
              // const tab = [...event.target.files];
              setPictures(event.target.files);
              // console.log(typeof pictures);
            }}
          />

          <label htmlFor="candidate_name"></label>
          <input
            id="candidate_name"
            value={body.name}
            type="text"
            placeholder="Nom du candidat"
            onChange={(event) => {
              const tab = { ...body };
              tab.name = event.target.value;
              setBody(tab);
            }}
          />

          <label htmlFor="candidate_description"></label>
          <textarea
            id="candidate_description"
            value={body.description}
            placeholder="Description du candidat"
            type="text"
            onChange={(event) => {
              const tab = { ...body };
              tab.description = event.target.value;
              setBody(tab);
            }}
          />

          {/* disable={isWaiting} */}

          <button type="submit">Soumettre</button>
        </form>
      </div>
    </>
  );
};

export default AddCandidate;
