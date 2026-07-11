export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Classic White Shirt",
    category: "Shirt",
    price: 799,
    image: "/products/shirt1.jpg",
  },
  {
    id: 2,
    name: "Formal Blue Shirt",
    category: "Shirt",
    price: 899,
    image: "/products/shirt2.jpg",
  },
  {
    id: 3,
    name: "Red Kurti",
    category: "Kurti",
    price: 999,
    image: "/products/kurti1.jpg",
},
  {
    id: 4,
    name: "Floral Kurti",
    category: "Kurti",
    price: 1099,
    image: "/products/kurti2.jpg",
  },
  {
    id: 5,
    name: "Designer Kurti",
    category: "Kurti",
    price: 1199,
    image: "/products/kurti3.jpg",
  }
];