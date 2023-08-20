import { Tabs, Space } from "antd";
import MoviesList from "../moviesList/MoviesList";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: `Search`,
    children: <MoviesList />,
  },
  {
    key: "2",
    label: `Rate`,
    children: `Content of Tab Pane 2`,
  },
];

const Header = () => (
  <Tabs
    defaultActiveKey="1"
    items={items}
    onChange={onChange}
    style={{ display: "flex", alignItems: "center" }}
  />
);
export default Header;
