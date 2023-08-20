import { useEffect, useState } from "react";
import { Progress, Space, List, Rate, Input, Pagination } from "antd";
import { debounceCallback } from "debounce-callback";
import useMovieService from "../../services/MovieService";
import GenreList from "../genreList/GenreList";
import ReleaseDate from "../releaseDate/releaseDate";

function MoviesList() {
  const [movieData, setMovieData] = useState([]);
  const [searchStatus, setSerchStatus] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [totalPages, setTotalPages] = useState();
  const { getAllMovies, getSearchedMovies, getPagesInfo } = useMovieService();

  useEffect(() => {
    if (!searchStatus) {
      /* console.log(`первый вызов ${currentPage}`); */
      getAllMovies(currentPage)
        .then((res) => setMovieData(res))
        .catch("e");
    }
  }, [currentPage]);

  useEffect(() => {
    if (searchStatus) {
      /* console.log(`вызов найденных фильмов для страницы ${currentPage}`); */
      getSearchedMovies(searchedValue, currentPage)
        .then((res) => {
          setMovieData(res.list); //не передается страница. в консоли ундеф
          setTotalPages(res.total);
        })
        .catch("e");
    }
    console.log(movieData);
  }, [searchedValue, currentPage]);

  useEffect(() => {
    if (!searchStatus) {
      getPagesInfo()
        .then((res) => setTotalPages(res.total_pages))
        .catch("e");
    }
  }, []);

  const onSearch = debounceCallback((inputValue) => {
    if (inputValue) {
      setSerchStatus(true);
      setCurrentPage(1);
      setSearchedValue(inputValue);

      /* console.log("in"); */
    } else {
      setSerchStatus(false);
      setCurrentPage(1);
      getAllMovies() //удалил тут currentPageсо входа . по идее он не нужен
        .then((res) => setMovieData(res))
        .catch("e");
    }
  }, 1000);

  return (
    <>
      <Input
        placeholder="Type to search..."
        style={{ maxWidth: 850, marginLeft: -40 }}
        onChange={(e) => {
          onSearch(e.target.value);
        }}
      />
      <List
        itemLayout="vertical"
        style={{ maxWidth: 1010, margin: "0 auto", padding: 20 }}
        size="large"
        grid={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
        dataSource={movieData}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: 0,
              paddingRight: 10,
              height: 280,
              maxWidth: 450,
              display: "flex",
              flexDirection: "row-reverse",
              justifyItems: "space-between",
              boxShadow: "0px 4px 12px 0px rgba(0, 0, 0, 0.15)",
            }}
            key={item.title}
            extra={
              <img
                width={180}
                height={280}
                alt={item.title}
                src={item.poster}
                style={{ marginLeft: -24, marginRight: 20 }}
              />
            }
          >
            <div
              style={{
                height: 270,

                display: "flex",
                flexDirection: "column",

                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: 0,
                  }}
                >
                  <h4 style={{ textAlign: "left", margin: 0 }}>{item.title}</h4>
                  <div>
                    <Space wrap>
                      <Progress
                        type="circle"
                        format={(percent) => `${percent / 10}`}
                        percent={item.vote_average * 10}
                        size={30}
                        strokeColor={
                          item.vote_average > 0 && item.vote_average < 3
                            ? "#E90000"
                            : item.vote_average >= 3 && item.vote_average < 5
                            ? "#E97E00"
                            : item.vote_average >= 5 && item.vote_average < 7
                            ? "#E9D100"
                            : "#66E900"
                        }
                        trailColor={"#D9D9D9"}
                      />
                    </Space>
                  </div>
                </div>

                <ReleaseDate releaseDate={item.release_date} />
                <GenreList genreArr={item.genre_ids} />
                <div
                  style={{
                    height: 130,
                    width: 230,
                    marginBottom: 10,
                    overflow: "hidden",
                    textAlign: "left",
                  }}
                >
                  {item.overview}
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <Rate
                  allowHalf
                  defaultValue={10}
                  count={10}
                  style={{ fontSize: 16 }}
                />
              </div>
            </div>
          </List.Item>
        )}
      />
      <Pagination
        onChange={(page) => {
          setCurrentPage(page);
          console.log(`консоль в онченьже${page}`);
          /* console.log(`search = ${searchCurrentPage}, st = ${currentPage}`); */
        }}
        defaultCurrent={1}
        current={currentPage}
        total={totalPages} //я попробовал подвязать тотал к ответу с сервера. после 500й страницы выдает 422 ошибку. это ограничение самой апишки.
        showSizeChanger={false}
      />
    </>
  );
}

export default MoviesList;
