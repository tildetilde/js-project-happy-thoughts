"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ThoughtForm from "./components/ThoughtForm";
import ThoughtList from "./components/ThoughtList";
import Spinner from "./components/Spinner";
import MyLikedThoughts from "./components/MyLikedThoughts";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";

export type Thought = {
  id: string;
  message: string;
  likes: number;
  timestamp: Date;
  createdBy: string;
};

type DecodedToken = {
  id: string;
  exp: number;
  iat: number;
};

const API_BASE = "https://happy-thoughts-api-5hw3.onrender.com";
const plingSound = "/ding.wav";

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!token);
  const [loading, setLoading] = useState(false);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [likedThoughtIds, setLikedThoughtIds] = useState<string[]>([]);
  const [posting, setPosting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("likedThoughts");
    setToken(null);
    setIsLoggedIn(false);
    setCurrentUserId(null);
    setLikedThoughtIds([]);
  };

  useEffect(() => {
    const fetchThoughts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE}/thoughts`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData: Thought[] = data.thoughts.map((item: any) => ({
          id: item._id,
          message: item.message,
          likes: item.hearts,
          timestamp: new Date(item.createdAt),
          createdBy: item.createdBy,
        }));

        setThoughts(transformedData);
      } catch (error) {
        console.error("Error fetching thoughts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchThoughts();

    const stored = localStorage.getItem("likedThoughts");
    if (stored) {
      setLikedThoughtIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setCurrentUserId(decoded.id);
      } catch (err) {
        console.error("Invalid token", err);
        setCurrentUserId(null);
      }
    }
  }, [token]);

  useEffect(() => {
    if (isLoggedIn) {
      setShowLogin(false);
      setShowSignup(false);
    }
  }, [isLoggedIn]);

  const addThought = async (message: string) => {
    if (!token) {
      alert("Please log in to post a thought.");
      return;
    }

    setPosting(true);
    try {
      const response = await fetch(`${API_BASE}/thoughts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
      } else {
        const newThoughtData = await response.json();
        const newThought: Thought = {
          id: newThoughtData._id,
          message: newThoughtData.message,
          likes: newThoughtData.hearts,
          timestamp: new Date(newThoughtData.createdAt),
          createdBy: newThoughtData.createdBy,
        };
        setThoughts([newThought, ...thoughts]);

        const audio = new Audio(plingSound);
        audio.volume = 0.2;
        audio.play();
      }
    } catch (error: any) {
      console.error("Error posting thought:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleEdit = async (id: string, newMessage: string) => {
    try {
      const response = await fetch(`${API_BASE}/thoughts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const updated = await response.json();

      setThoughts((prev) =>
        prev.map((thought) =>
          thought.id === id
            ? {
                ...thought,
                message: updated.message || newMessage,
                timestamp: new Date(updated.updatedAt || thought.timestamp),
              }
            : thought
        )
      );
    } catch (error) {
      console.error("Failed to edit thought", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/thoughts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setThoughts((prev) => prev.filter((thought) => thought.id !== id));
    } catch (error) {
      console.error("Failed to delete thought", error);
    }
  };

  const handleLike = async (id: string) => {
    setThoughts((prev) =>
      prev.map((thought) =>
        thought.id === id ? { ...thought, likes: thought.likes + 1 } : thought
      )
    );

    try {
      await fetch(`${API_BASE}/thoughts/${id}/like`, {
        method: "PATCH",
      });
    } catch (error) {
      console.error("Failed to send like to API", error);
    }

    setLikedThoughtIds((prev) => {
      if (prev.includes(id)) return prev;
      const updated = [...prev, id];
      localStorage.setItem("likedThoughts", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="mx-auto max-w-md my-4 space-y-4 px-4 sm:px-4 md:px-0 lg:px-0 xl:px-0">
      <nav className="flex justify-between items-center mb-4">
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="text-sm text-pink-600 hover:underline"
          >
            Log out
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => {
                setShowLogin(true);
                setShowSignup(false);
              }}
              className="text-sm text-blue-600 hover:underline"
            >
              Log in
            </button>
            <button
              onClick={() => {
                setShowSignup(true);
                setShowLogin(false);
              }}
              className="text-sm text-green-600 hover:underline"
            >
              Sign up
            </button>
          </div>
        )}
      </nav>

      {!isLoggedIn && showLogin && <LoginForm onLogin={login} />}
      {!isLoggedIn && showSignup && <SignupForm onSignup={login} />}

      <ThoughtForm onSubmit={addThought} isPosting={posting} />

      {loading ? (
        <Spinner />
      ) : (
        <>
          <ThoughtList
            thoughts={thoughts}
            onLike={handleLike}
            onDelete={handleDelete}
            onEdit={handleEdit}
            currentUserId={currentUserId}
          />
          <MyLikedThoughts
            thoughts={thoughts}
            likedThoughtIds={likedThoughtIds}
          />
        </>
      )}
    </div>
  );
}
