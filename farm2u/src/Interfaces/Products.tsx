export interface products{
    _id:string,
    heading:string,
    image1:string,
    qty:number,
    price:number,
    discount:number,
    sellerName:string,
    seller:string,
    comments:Comment[]
}
export interface Comment{
    comment:string,
    rating:number,
    publishDate:string,
    name:string
}
export interface ProductData {
    _id: string;
    heading: string;
    price: number;
    discount: number;
    image1: string;
    image2: string;
    image3: string;
    image4: string;
    description: string;
    comments: Comment[];
    qty: number;
  }
  export interface cartData{
    productId:string,
    quantity:number,
    _id:string
  }