import Image1 from "../assets/Image-1.jpg"
import Image2 from "../assets/Image-2.jpg"
import Image3 from "../assets/Image-3.webp"
import Image4 from "../assets/Image-4.jpg"
import Image5 from "../assets/Image-5.jpg"

export const Images = [
    {
      id: "1",
      image: Image1,
      annotations: [
        {
          x: 0,
          y: 0,
          width: 50,
          height: 100
        },
        {
          x: 75,
          y: 50,
          width: 50,
          height: 100
        }
      ]
    },
    {
      id: "2",
      image: Image2,
      annotations: []
    },
    {
      id: "3",
      image: Image3,
      annotations: []
    },
    {
      id: "4",
      image: Image4,
      annotations: []
    },
    {
      id: "5",
      image: Image5,
      annotations: []
    }
  ];