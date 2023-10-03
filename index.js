/* For Run The App Follow This Steps 
                                                    1. "npm i" Enter this command to install all library i use  
                                                    2. "npm start" For start the server
                                                    */
const express = require("express");
const axios = require("axios");
const _ = require("lodash");

//PORT
const port = 9090;

const app = express();

//GET : /api/blog-stats
app.get("/api/blog-stats", async (req, res) => {
  try {
    await axios
      .get("https://intent-kit-16.hasura.app/api/rest/blogs", {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      })
      .then((result) => {
        const data = result.data;
        const blogs = data.blogs;
        const totalBlogs = blogs.length;

        const longestTitle = _.maxBy(blogs, "title.length").title;

        const privacyBlogs = _.filter(blogs, (blog) =>
          blog.title.toLowerCase().includes("privacy")
        ).length;

        const uniqueTitles = _.uniqBy(blogs, "title");

        return res.status(200).json({
          totalBlogs,
          longestTitle,
          privacyBlogs,
          uniqueTitles: uniqueTitles.map((blog) => blog.title),
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Error fetching blog data" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something Wents Wrong" });
  }
});

//GET : /api/blog-search
app.get("/api/blog-search", async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: "Query parameter required" });
  }

  try {
    // Fetch blogs
    await axios
      .get("https://intent-kit-16.hasura.app/api/rest/blogs", {
        headers: {
          "x-hasura-admin-secret":
            "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6",
        },
      })
      .then((result) => {
        const data = result.data;
        const blogs = data.blogs;

        // Filter blogs by search query
        const filteredBlogs = blogs.filter((blog) =>
          blog.title.toLowerCase().includes(query.toLowerCase())
        );

        return res.status(200).json(filteredBlogs);
      })
      .catch((err) => {
        console.log(err);
        return res.status(400).json({ message: "Error fetching blog data" });
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something Wents Wrong" });
  }
});

app.listen(port, () => {
  console.log(`Server started on  http://localhost:${port}`);
});
