import { cartData, products } from "@/Interfaces/Products";

export const calculatePrices=(cartData:cartData[],cartDataContents:products[])=>{
    let tp = 0;
    let dp = 0;
    if (cartData.length !== 0 && cartDataContents.length !== 0) {
      cartData.map((item: any, index: number) => {
        const dataelement = cartDataContents.find(
          (i: any) => i._id === item.productId
        );
        if (dataelement) {
          tp += dataelement.price * item.quantity;
          dp +=
            Math.floor(
              dataelement.price -
                (dataelement.discount * dataelement.price) / 100
            ) * item.quantity;
        }
      });
    }
    return [tp,dp];
}