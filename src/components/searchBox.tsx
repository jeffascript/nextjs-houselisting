import { ChangeEvent } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useGoogleMapsScript, Libraries } from "use-google-maps-script";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

export interface ISearchBoxProps {
  onSelectAddress: (
    address: string,
    latitude: number | null,
    longitude: number | null
  ) => void;
  defaultValue: string;
}

const libraries: Libraries = ["places"];

export const SearchBox = ({
  onSelectAddress,
  defaultValue,
}: ISearchBoxProps) => {
  const { isLoaded, loadError } = useGoogleMapsScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? "", //if null||undefined, return ""

    libraries,
  });

  if (!isLoaded) return null;
  if (loadError) return <div>... Error Loading ...</div>;

  return (
    <ReadySearchBox
      defaultValue={defaultValue}
      onSelectAddress={onSelectAddress}
    />
  );
};

function ReadySearchBox({ onSelectAddress, defaultValue }: ISearchBoxProps) {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({ debounce: 300, defaultValue }); //setValue from usePlacesAutocomplete

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (e.target.value === "") {
      onSelectAddress("", null, null);
    }
  };

  const handleOnSelect = async (address: string) => {
    setValue(address, false); //since setValue from usePlacesAutocomplete has another param, which is should fetch data
    clearSuggestions();
    try {
      const [firstResult] = await getGeocode({ address }); //destructued results, to get first result
      const { lat, lng } = await getLatLng(firstResult); //alterantively results[0] if I haven't destructred above
      onSelectAddress(address, lat, lng);
    } catch (err) {
      console.error(`😤  Error: `, err);
    }
  };

  // console.log({ status, data }); //OK && address is returned from this
  return (
    <Combobox onSelect={handleOnSelect}>
      <ComboboxInput
        // data={data}
        id="search"
        value={value}
        onChange={handleChange}
        disabled={!ready}
        placeholder="Search for your location ..."
        className="w-full p-2"
        autoComplete="off"
      />

      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption key={place_id} value={description} />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
}
