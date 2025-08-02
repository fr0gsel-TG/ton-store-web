import axios from 'axios';
import cheerio from 'cheerio';

export default async (req, res) => {
    try {
        const { q } = req.query;
        const response = await axios.get(`https://aliexpress.ru/wholesale?SearchText=${q}`);
        const $ = cheerio.load(response.data);
        
        const products = [];
        $('.product-card').slice(0, 5).each((i, el) => {
            products.push({
                title: $(el).find('.product-title').text().trim(),
                price: $(el).find('.price-current').text().trim(),
                url: 'https://aliexpress.ru' + $(el).find('a').attr('href')
            });
        });

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Ошибка парсинга" });
    }
};