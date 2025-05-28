import mongoose from "mongoose";
export interface IListing extends Document {
  id: string;
  title: string;
  type: string;
  price: number;
  state: string;
  city: string;
  areaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  furnished: 'Furnished' | 'Unfurnished' | 'Semi';
  availableFrom: Date;
  listedBy: 'Builder' | 'Owner' | 'Agent';
  tags: string[];
  colorTheme: string;
  rating: number;
  isVerified: boolean;
  listingType: 'rent' | 'sale';
  createdBy:mongoose.Schema.Types.ObjectId;
}
