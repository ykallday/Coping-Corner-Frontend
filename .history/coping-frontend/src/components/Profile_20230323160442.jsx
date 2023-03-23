import React, { useState, useEffect, useContext } from "react";
import { GetResources } from "../Services/ResourceServices";
import { CheckSession } from "../Services/Auth";
import { UserProvider } from "../UserProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  // initialize states
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);

  // import context
  const { resources } = useContext(UserProvider);
  let navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  // navigate to detail page when a resource is clicked
  const showResource = (index) => {
    navigate(`/resources/detail/${index}`);
  };

  // fetch users data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await CheckSession();
        setUser(user);
        setLoading(false);
        console.log(user);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
      console.log(user);
    };
    fetchUser();
  }, []);

  // fetch resource data
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        let payload = {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        };

        const res = await axios.get(
          `http://localhost:3001/api/favorite/${user.id}`,
          payload
        );
        setUserFavorites(res.data);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavorites();
  }, [user]);

  const showEdit = () => {
    navigate(`/EditProfile`)
  };

  if (loading) {
    return <p> Loading... </p>;
  }

  if (error) {
    return <p> Error: {error.message} </p>;
  }

  // sorts the resources by newest date
  const sortResources = resources.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // storing the 5 most recent resources
  const mostRecentResource = sortResources.slice(0, 5);

  return (
    <div className="profile-page">
      <div>
        <button id="go-back" onClick={goBack}>
          Go Back
        </button>
      </div>
      <div className="header">
        <h2 className="welcome-back"> Welcome back, {user.username}! </h2>
      </div>
      <div className="profile-grid">
        <div className="card-container">
          <h3 className="profile-titles">Recent Resources</h3>
          {mostRecentResource.map((resource) => (
            <div
              className="resource-card-profile"
              key={resource.id}
              onClick={() => showResource(resource.id)}
            >
              <h1> {resource.title} </h1>
              <h5 className="resource-type">
                <span className="category-for-card">TYPE</span>
                {resource.type.join(", ")}{" "}
              </h5>
              <h5 className="resource-feeling">
                {" "}
                <span className="category-for-card">
                  FOR WHEN YOU'RE FEELING
                </span>
                {resource.feeling.join(", ")}{" "}
              </h5>
              <h2 className="preview-text"> {resource.preview_text} </h2>
              <div className="container-for-image">
                <img className="small-img-card" src={resource.optional_image} />
              </div>
              <h5>
                {" "}
                <span className="category-for-card">TIME REQUIREMENT</span>
                {resource.time_requirement} minutes{" "}
              </h5>
            </div>
          ))}
        </div>

        <div className="card-container">
          <h3 className="profile-titles">Your Toolkit</h3>
          {userFavorites ? (
            userFavorites
              // sort and store the 5 most recently favorited resources
              .sort((a, b) => b.time_favorited - a.time_favorited)
              .slice(0, 5)
              .map((favorite) => {
                const resource = favorite.Resource;
                return (
                  <div
                    className="resource-card-profile"
                    key={favorite.id}
                    onClick={() => showResource(resource.id)}
                  >
                    <h1> {resource.title} </h1>
                    <h5 className="resource-type">
                      <span className="category-for-card">TYPE</span>
                      {resource.type.join(", ")}{" "}
                    </h5>
                    <h5 className="resource-feeling">
                      {" "}
                      <span className="category-for-card">
                        FOR WHEN YOU'RE FEELING
                      </span>
                      {resource.feeling.join(", ")}{" "}
                    </h5>
                    <h2 className="preview-text"> {resource.preview_text} </h2>
                    <div className="container-for-image">
                      <img
                        className="small-img-card"
                        src={resource.optional_image}
                      />
                    </div>
                    <h5>
                      {" "}
                      <span className="category-for-card">
                        TIME REQUIREMENT
                      </span>
                      {resource.time_requirement} minutes{" "}
                    </h5>
                  </div>
                );
              })
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* <div className = "card-container">
            <h3 className="profile-titles">Your Comments</h3>
            <div className = "resource-card-profile">
              <h3>Nothing to see here yet!</h3>
              <h4>This is where the comments *might* go</h4>
            </div>
            </div> */}
    </div>
  );
}

export default Profile;
