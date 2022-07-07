const express = require('express');
const router = express.Router();
const fetch = require("node-fetch");

router.use('/', (req, res, next) => {
    // Récupère depuis https://dev.to/api/articles/latest?username=thomasbnt
    fetch('https://dev.to/api/articles/latest?username=thomasbnt')
        .then(response => response.json())
        .then(data => {
            let allArticles = [];
            data.forEach(article => {
                allArticles.push({
                    title: article.title,
                    url: article.url,
                    description: article.description,
                    published_at: article.published_at,
                    tags: article.tag_list
                });
            })
            res.status(200).json(allArticles);
            next();
        });
})
module.exports = router;
