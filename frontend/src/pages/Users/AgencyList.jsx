import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AgencyList() {
  const [agencies, setAgencies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgencies = async () => {
      const authToken = localStorage.getItem("access_token");
      if (authToken) {
        try {
          const api = axios.create({
            baseURL: "http://127.0.0.1:8000/api/",
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
            withCredentials: true,
          });

          const response = await api.get("users/agency/");
          setAgencies(response.data);
        } catch (error) {
          console.error("Fetch event managers error:", error);
        }
      } else {
        // Redirect to login page or handle unauthorized access
        navigate("/login");
      }
    };

    fetchAgencies();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl mb-4 text-center font-bold uppercase">
        Agency List
      </h1>
      <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
        {agencies.map((agency) => (
          <div key={agency.id} className="flex flex-col max-w-[360px]">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>{agency.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Link to={`/agency/${agency.id}`}>
                  <img
                    src={
                      agency.pfp
                        ? `${agency.pfp}`
                        : `http://127.0.0.1:8000/media/user_avatar/default.jpg`
                    }
                    width={320}
                    className="aspect-square h-auto max-w-full object-cover rounded-full mb-4 shadow-lg"
                    alt={agency.name}
                  />
                </Link>
              </CardContent>
              <CardFooter className="flex flex-col">
                <ReactStars
                  isHalf={true}
                  edit={false}
                  count={5}
                  value={agency.average_rating} // Assuming this comes from your API data
                  //   onChange={ratingChanged}
                  size={24}
                  activeColor="#ffd700"
                />
                <p>No. of tours: {agency.num_of_tours}</p>
              </CardFooter>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
