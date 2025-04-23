import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('BDS Crawler đang chạy...');
});

app.post('/crawl', async (req, res) => {
  const { location = "quan-7", type = "can-ho-chung-cu" } = req.body;
  const url = `https://batdongsan.com.vn/ban-${type}-${location}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const results = [];

    $('.js__product-link-for-product-id').each((i, el) => {
      if (i >= 5) return false; // Giới hạn 5 kết quả
      results.push({
        title: $(el).text().trim(),
        link: 'https://batdongsan.com.vn' + $(el).attr('href')
      });
    });

    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên cổng ${port}`);
});
