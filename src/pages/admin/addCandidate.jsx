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
  // const [isWaiting, setIsWaiting] = useState(false);

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
        `${backurl}/candidate/create`,
        formData,
        {
          headers: {
            Authorization: userMongoId,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      // navigate(`/offer/${response.data._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setIsWaiting(false);
    }
  };

  const handleNameChange = (event) => setName(event.target.value);
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
        <form>
          <label htmlFor="candidate_name"></label>
          <input
            id="candidate_name"
            value={name}
            type="text"
            onChange={handleNameChange}
          />
        </form>
      </div>
    </>
  );
};

export default AddCandidate;
