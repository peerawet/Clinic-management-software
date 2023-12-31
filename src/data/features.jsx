import CheckIn from "../component/Feature/CheckIn";
import NewPatient from "../component/Feature/NewPatient";
import Appointment from "../component/Feature/Appointment";
export const features = [
  {
    name: "Check in",
    component: <CheckIn />,
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfhDIKBjCp2poPUnqR7I7H81Dr3gV2DExz8f0du-TNMr_z33hL6MOjKletvfTvROTRAZQ&usqp=CAU",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    name: "New Patient",
    component: <NewPatient />,
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ19SD6m44yrgdWvANqrHxkfNTo5WpYAyBpTK1s54CuKgqC22nrPec-61OyuWW4hEGoGzM&usqp=CAU",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    name: "Appointment",
    component: <Appointment />,
    picture:
      "data:image/png;base64,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",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    name: "Search",
    component: "<Search />",
    picture:
      "https://static.vecteezy.com/system/resources/previews/000/633/234/original/search-icon-symbol-sign-vector.jpg",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    name: "Finance",
    component: "<Finance />",
    picture:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRC5oQMxW6aX1eDLbC7y875EDyS8378Wj6l6timyioJvp9rcPmxz9UZh-vjKoVUqtxuQk&usqp=CAU",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    name: "Custom",
    component: "<Custom />",
    picture: "https://static.thenounproject.com/png/2397501-200.png",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];
