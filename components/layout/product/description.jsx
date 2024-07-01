export default function ProductDescription({ product }) {

  return (
    <div className="flex my-12 w-full justify-center">
      <div className="content w-full max-w-6xl">
        <h2 className="text-2xl font-semibold my-4 underline">
          {product?.name + "'s"} specifications
        </h2>
        <div className="product-details prose prose-zinc prose-md min-w-[100%] w-full">
          <h1>
            Ultimate Waterproof Hiking Backpack – Durable, Spacious, and
            Ergonomic
          </h1>

          <p>
            The Ultimate Waterproof Hiking Backpack is designed for the avid
            outdoor adventurer. Whether {"you're "}trekking through rain-soaked
            trails or navigating rugged terrain, this backpack offers unmatched
            durability and functionality. Crafted from high-quality waterproof
            materials, it keeps your gear dry in any weather. With multiple
            compartments and an ergonomic design, it provides ample storage and
            comfortable carrying, making it the perfect companion for all your
            outdoor excursions.
          </p>

          <h2>Key Features and Benefits</h2>
          <ul>
            <li>
              <strong>Waterproof Material:</strong> Keeps your belongings dry in
              wet conditions.
            </li>
            <li>
              <strong>Multiple Compartments:</strong> Offers organized storage
              for all your gear.
            </li>
            <li>
              <strong>Ergonomic Design:</strong> Padded shoulder straps and back
              panel for maximum comfort.
            </li>
            <li>
              <strong>Built-in Hydration System:</strong> Stay hydrated on the
              go with the convenient hydration bladder compartment.
            </li>
          </ul>

          <h2>Technical Specifications</h2>
          <ul>
            <li>
              <strong>Dimensions:</strong> 22 x 14 x 9 inches
            </li>
            <li>
              <strong>Weight:</strong> 1.5 pounds
            </li>
            <li>
              <strong>Material:</strong> High-density waterproof nylon
            </li>
            <li>
              <strong>Capacity:</strong> 40 liters
            </li>
          </ul>

          <h2>Usage Instructions</h2>
          <p>
            <strong>Adjusting Straps:</strong> Customize the fit by adjusting
            the shoulder and waist straps for optimal comfort.
            <br />
            <strong>Maintenance:</strong> Clean with mild soap and water; air
            dry.
            <br />
            <strong>Safety Precautions:</strong> Ensure all zippers are closed
            properly to maintain waterproof integrity.
          </p>
        </div>
      </div>
    </div>
  );
}
