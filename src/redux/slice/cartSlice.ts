import { Product } from "@/types/responses/product";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductWithAmount = {
  slug: string;
  amount: number;
};

interface Order {
  pharmacy_slug: string;
  shipment_method_id: number;
  address: string;
  coordinate: {
    lon: number;
    lat: number;
  };
  items: ProductWithAmount[];
}

export interface UserOrders {
	account_id?: number;
	user_id: number;
	location_id?: number;
	order: Order[];
	n_item: number;
	total: number;
}

interface ChatPrescriptions {
  user_id: number;
  products: ProductWithAmount[];
}

export interface InitialCartState {
  store: UserOrders[];
}

interface OrderRequest {
	account_id?: number;
	user_id: number;
	product_slug: string;
	pharmacy_slug: string;
  amount?: number;
}

interface PharmacyRequest {
  user_id: number;
  pharmacy_slug: string;
}

interface LocationRequest {
  user_id: number;
  location_id: number;
}

interface ShipmentRequest {
  user_id: number;
  pharmacy_slug: string;
  shipment_method_id: number;
}

interface UpdateSummaryRequest {
	user_id: number;
	n_item: number;
	total: number;
}

const initialState: InitialCartState = {
  store: [],
};

export const cartSlice = createSlice({
	name: "carts",
	initialState,
	reducers: {
		addOrder: (state, action: PayloadAction<OrderRequest>) => {
			const userIdx = state.store.findIndex(
				(s) => s.user_id === action.payload.user_id
			);
			if (userIdx === -1) {
				state.store.push({
					account_id: action.payload.account_id,
					user_id: action.payload.user_id,
					order: [
						{
							pharmacy_slug: action.payload.pharmacy_slug,
							shipment_method_id: 1,
							address: "",
							coordinate: {
								lat: 0,
								lon: 0,
							},
							items: [{ slug: action.payload.product_slug, amount: 1 }],
						},
					],
					n_item: 1,
					total: 0,
				});
				return;
			}

      const userOrders = state.store[userIdx];
      const orderIdx = userOrders.order.findIndex(
        (o) => o.pharmacy_slug === action.payload.pharmacy_slug
      );

      if (orderIdx === -1) {
        userOrders.order.push({
          pharmacy_slug: action.payload.pharmacy_slug,
          shipment_method_id: 1,
          address: "",
          coordinate: {
            lat: 0,
            lon: 0,
          },
          items: [{ slug: action.payload.product_slug, amount: action.payload.amount ?? 1 }],
        });
        return;
      }

      const productIdx = userOrders.order[orderIdx].items.findIndex(
        (p) => p.slug === action.payload.product_slug
      );
      if (productIdx === -1) {
        userOrders.order[orderIdx].items.push({
          slug: action.payload.product_slug,
          amount: 1,
        });
        return;
      }

      userOrders.order[orderIdx].items[productIdx].amount += 1;
    },
    // prescribe: (state, action: PayloadAction<ChatPrescriptions>) => {
    //   const userIdx = state.store.findIndex(
    //     (s) => s.user_id === action.payload.user_id
    //   );

    //   let products = action.payload.products;
    //   let orders = products.map((product, i) => {
    //     const productIdx = userOrders.order[orderIdx].items.findIndex(
    //       (p) => p.slug === product.slug
    //     );

    //     let a={
    //       pharmacy_slug: action.payload.pharmacy_slug,
    //       shipment_method_id: 1,
    //       address: "",
    //       coordinate: {
    //         lat: 0,
    //         lon: 0,
    //       },
    //       items: [{ slug: action.payload.product_slug, amount: 1 }],
    //     };
    //     if (productIdx === -1) {
    //       userOrders.order[orderIdx].items.push({
    //         slug: product.slug,
    //         amount: product.amount,
    //       });
    //     } else {
    //       userOrders.order[orderIdx].items[productIdx].amount +=
    //         product.amount;
    //     }
    //   });
    //   if (userIdx === -1) {
    //     state.store.push({
    //       user_id: action.payload.user_id,
    //       order: [
    //         {
    //           pharmacy_slug: action.payload.pharmacy_slug,
    //           shipment_method_id: 1,
    //           address: "",
    //           coordinate: {
    //             lat: 0,
    //             lon: 0,
    //           },
    //           items: [{ slug: action.payload.product_slug, amount: 1 }],
    //         },
    //       ],
    //       n_item: 0,
    //     });
    //     return;
    //   }

    //   const userOrders = state.store[userIdx];
    //   const orderIdx = userOrders.order.findIndex(
    //     (o) => o.pharmacy_slug === action.payload.pharmacy_slug
    //   );

    //   if (orderIdx === -1) {
    //     userOrders.order.push({
    //       pharmacy_slug: action.payload.pharmacy_slug,
    //       shipment_method_id: 1,
    //       address: "",
    //       coordinate: {
    //         lat: 0,
    //         lon: 0,
    //       },
    //       items: [{ slug: action.payload.product_slug, amount: 1 }],
    //     });
    //     return;
    //   }

    //   const productIdx = userOrders.order[orderIdx].items.findIndex(
    //     (p) => p.slug === action.payload.product_slug
    //   );
    //   if (productIdx === -1) {
    //     userOrders.order[orderIdx].items.push({
    //       slug: action.payload.product_slug,
    //       amount: 1,
    //     });
    //     return;
    //   }

    //   userOrders.order[orderIdx].items[productIdx].amount += 1;
    // },

    decrementProductOrder: (state, action: PayloadAction<OrderRequest>) => {
      const userIdx = state.store.findIndex(
        (s) => s.user_id === action.payload.user_id
      );
      if (userIdx === -1) {
        return;
      }

      const userOrders = state.store[userIdx];
      const orderIdx = userOrders.order.findIndex(
        (o) => o.pharmacy_slug === action.payload.pharmacy_slug
      );

      if (orderIdx === -1) {
        return;
      }

      const productIdx = userOrders.order[orderIdx].items.findIndex(
        (p) => p.slug === action.payload.product_slug
      );
      if (productIdx === -1) {
        return;
      }

      if (userOrders.order[orderIdx].items[productIdx].amount === 1) {
        userOrders.order[orderIdx].items.splice(productIdx, 1);
        return;
      }

      userOrders.order[orderIdx].items[productIdx].amount -= 1;
    },
    incrementProductOrder: (state, action: PayloadAction<OrderRequest>) => {
      const userIdx = state.store.findIndex(
        (s) => s.user_id === action.payload.user_id
      );
      if (userIdx === -1) {
        return;
      }

      const userOrders = state.store[userIdx];
      const orderIdx = userOrders.order.findIndex(
        (o) => o.pharmacy_slug === action.payload.pharmacy_slug
      );

      if (orderIdx === -1) {
        return;
      }

      const productIdx = userOrders.order[orderIdx].items.findIndex(
        (p) => p.slug === action.payload.product_slug
      );
      if (productIdx === -1) {
        return;
      }

      userOrders.order[orderIdx].items[productIdx].amount += 1;
    },
    deleteProductOrder: (state, action: PayloadAction<OrderRequest>) => {
      const userIdx = state.store.findIndex(
        (s) => s.user_id === action.payload.user_id
      );
      if (userIdx === -1) {
        return;
      }

      const userOrders = state.store[userIdx];
      const orderIdx = userOrders.order.findIndex(
        (o) => o.pharmacy_slug === action.payload.pharmacy_slug
      );

      if (orderIdx === -1) {
        return;
      }

      const productIdx = userOrders.order[orderIdx].items.findIndex(
        (p) => p.slug === action.payload.product_slug
      );
      if (productIdx === -1) {
        return;
      }

      userOrders.order[orderIdx].items.splice(productIdx, 1);

      if (userOrders.order[orderIdx].items.length == 0) {
        userOrders.order.splice(orderIdx, 1);
      }
    },
    setOrderShipmentMethod: (state, action: PayloadAction<ShipmentRequest>) => {
      const userIdx = state.store.findIndex(
        (s) => s.user_id === action.payload.user_id
      );
      if (userIdx === -1) {
        return;
      }

      const userOrders = state.store[userIdx];
      const orderIdx = userOrders.order.findIndex(
        (o) => o.pharmacy_slug === action.payload.pharmacy_slug
      );

      if (orderIdx === -1) {
        return;
      }

      userOrders.order[orderIdx].shipment_method_id =
        action.payload.shipment_method_id;
    },
    resetCart: (state, action: PayloadAction<number>) => {
      const userIdx = state.store.findIndex(
        (s) => s.user_id === action.payload
      );
      if (userIdx === -1) {
        return;
      }

      state.store.splice(userIdx, 1);
    },
    setDeliveryLocationID: (state, action: PayloadAction<LocationRequest>) => {
      const userIdx = state.store.findIndex(
        (s) => s.user_id === action.payload.user_id
      );
      if (userIdx === -1) {
        return;
      }

			state.store[userIdx].location_id = action.payload.location_id;
		},
		updateCartSummary: (state, action: PayloadAction<UpdateSummaryRequest>) => {
			const userIdx = state.store.findIndex(
				(s) => s.user_id === action.payload.user_id
			);
			if (userIdx === -1) {
				return;
			}

			const userOrders = state.store[userIdx];
			userOrders.total = action.payload.total,
			userOrders.n_item = action.payload.n_item
		}
	},
});

export const { addOrder, incrementProductOrder, decrementProductOrder, deleteProductOrder, resetCart, setOrderShipmentMethod, setDeliveryLocationID, updateCartSummary } =
	cartSlice.actions;
export default cartSlice.reducer;
