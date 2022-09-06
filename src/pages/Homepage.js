import React, { useState, useEffect } from "react";
import Search from "../components/Search";
import Picture from "../components/Picture";
// useEffect => 將狀態改成一開啟頁面即顯示精選照片15張

const Homepage = () => {
  const [input, setInput] = useState("");
  const [data, setData] = useState(null);
  const [page, setPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const auth = "563492ad6f9170000100000157a200d5187e40feb1d63f68b8a5d07f";
  // 精選照片的網址
  const initialURL = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
  // 搜尋照片的網址
  const searchURL = `https://api.pexels.com/v1/search?query=${currentSearch}&page=1&per_page=15`;

  // fetch data from pexels api
  const search = async (url) => {
    setPage(2);
    // 向pexel網站發出網站發出需要"精選照片"的請求
    // fetch(): 發出一個獲取資源的req，會回傳一個promise
    const dataFetch = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });

    // res.json(): 將回傳資料解析為JSON格式，會回傳一個promise
    let parsedData = await dataFetch.json();

    setData(parsedData.photos);
  };

  // load more picture
  const morepicture = async () => {
    let newURL;
    if (currentSearch === "") {
      newURL = `https://api.pexels.com/v1/curated?page=${page}&per_page=15`;
    } else {
      newURL = `https://api.pexels.com/v1/search?query=${currentSearch}&page=${page}&per_page=15`;
    }
    setPage(page + 1);

    const dataFetch = await fetch(newURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: auth,
      },
    });

    // res.json(): 將回傳資料解析為JSON格式，會回傳一個promise
    let parsedData = await dataFetch.json();

    setData(data.concat(parsedData.photos));
  };

  // fetch when the page load up
  useEffect(() => {
    search(initialURL);
  }, []);

  useEffect(() => {
    if (currentSearch === "") {
      search(initialURL);
    } else {
      search(searchURL);
    }
  }, [currentSearch]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Search
        search={() => {
          setCurrentSearch(input);
        }}
        setInput={setInput}
      />
      <div className="pictures">
        {data &&
          data.map((d) => {
            return <Picture data={d} />;
          })}
      </div>
      <div className="morePicture">
        <button onClick={morepicture}>Load More</button>
      </div>
    </div>
  );
  // "data && data.map"是使用boolean的方式來確認我們是否要執行data.map。
  // "data"原本為null，是falsy，所以不會執行
};

export default Homepage;
