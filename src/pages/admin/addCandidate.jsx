import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalContext";
import axios from "axios";

const AddCandidate = () => {
  const { userMongoId, token, user } = useContext(GlobalContext);
  const [candidates, setCandidates] = useState([]);
  const [changed, setChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [body, setBody] = useState({
    name: "",
    description: "",
    performances: [],
  });

  const [pictures, setPictures] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const fetchcandidates = async () => {
      const candidateslist = await axios.get(
        `${import.meta.env.VITE_BACKURL}/candidate/list`
      );
      // console.log(candidateslist);
      setCandidates(candidateslist.data);
    };
    fetchcandidates();
    setIsLoading(false);
  }, [changed]);

  console.log(candidates);

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
            AdminHeader: userMongoId,
            "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
            email: user.email,
          },
        }
      );

      console.log(response.data);

      // navigate(`/offer/${response.data._id}`);
    } catch (error) {
      console.log(error.response.data.message);
      alert(error.response.data.message);
    } finally {
      setChanged(!changed);
      setIsWaiting(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <p style={{ paddingTop: 30, paddingBottom: 30 }}>Ajout d'un candidat</p>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
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

          <button type="submit">Rajouter Candidat</button>
        </form>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: 20 }}>
        {candidates.map((elem) => {
          return (
            <div key={elem._id}>
              <p>{elem.can_name}</p>
              <p>{elem.can_description}</p>
              <img
                src={elem.can_pics[0].secure_url}
                alt={elem.can_name}
                style={{ height: 200 }}
              />
            </div>
          );
        })}
      </div>
      <>{isLoading ? <p>Chargement</p> : <div></div>}</>
    </>
  );
};

export default AddCandidate;
