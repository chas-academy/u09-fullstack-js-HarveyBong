interface Item {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
    createdAt: string;
    createdBy: {
      name: string;
      id: string;
    }; 
  }

export default Item;