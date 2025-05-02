import React, { useRef, useState, useEffect } from "react";
import LazyLoad from "react-lazyload";
import QRCode from "qrcode.react";
import Help from "./Help";

const ModelViewer = ({ item, addToWishlist, removeFromWishlist, wishlist }) => {
  const [selectedVariant, setSelectedVariant] = useState('default');
  const [display, setDisplay] = useState(false);
  const [ARSupported, setARSupported] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [annotate, setAnnotate] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  let modelViewer1 = {
    backgroundColor: " #ecf0f3",
    overflowX: "hidden",
    posterColor: "#eee",
    width: "100%",
    height: ARSupported ? "85%" : "75%",
    borderRadius: 15,
  };

  const model = useRef();
  const varient = useRef(null);

  console.log(item);

  // Fullscreen toggle
  function toggle() {
    if (!document.fullscreenElement) {
      model.current.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  

  // Handle annotations
  const handleAnnotateClick = (annotation) => {
    const { orbit, target, position } = annotation;
    model.current.cameraTarget = position;
    model.current.orbit = target;
  };

  // AR Support check
  useEffect(() => {
    if (
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/iPad/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    ) {
      setARSupported(true);
    }
  }, []);

  useEffect(() => {
    const modelViewer = model.current;
    modelViewer &&
      modelViewer.addEventListener('load', () => {
        console.log('loaded');
        const availableVariants = modelViewer?.availableVariants;
        console.log(availableVariants);
        for (const variant of availableVariants) {
          const option = document.createElement('option');
          option.value = variant;
          option.textContent = variant;
          varient?.current?.appendChild(option);
        }

        const defaultOption = document.createElement('option');
        defaultOption.value = 'Default';
        defaultOption.textContent = 'Default';
        varient?.current?.appendChild(defaultOption);
      });

    varient?.current?.addEventListener('input', (event) => {
      modelViewer.variantName = event.target.value === 'Default' ? null : event.target.value;
    });
  }, []);

  useEffect(() => {
    if (wishlist) {
      const isInWishlist = wishlist.some((wishlistItem) => wishlistItem.id === item.id);
      setIsInWishlist(isInWishlist);
    }
  }, [item, wishlist]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
  
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  
  // Handle adding/removing from wishlist
  const handleAddToWishlist = () => {
    if (isInWishlist) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  // Handle download
  const handleDownload = () => {
    const modelFilePath = `/models/${item.modelSrc}`;
  
    // Fetch first to ensure the file exists and avoid broken download
    fetch(modelFilePath)
      .then(response => {
        if (!response.ok) {
          throw new Error("File not found");
        }
        return response.blob();
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${item.name || "model"}.glb`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url); // Clean up
      })
      .catch(error => {
        console.error("Download failed:", error);
        alert("Failed to download the file. Please check the file path or server.");
      });
  };
  
  
  

  return (
    <div className="model-view">
      <model-viewer
        key={item.id}
        ref={model}
        style={modelViewer1}
        src={item.modelSrc}
        ios-src={item.iOSSrc}
        alt="A 3D model"
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        auto-rotate
      >
        {ARSupported && (
          <button slot="ar-button" className="arbutton">
            View in your space
          </button>
        )}

        <button className="fullscreen-btn" onClick={toggle}>
          &#x26F6;<span>full screen</span>
        </button>
        {display ? (
          <>
       <button
  className={`close ${isFullscreen ? "fz" : ""}`}
  onClick={() => setDisplay(false)}
>
</button>

            <Help />
          </>
        ) : (
          <>
            <button className="help-btn" onClick={() => setDisplay(true)}>
              ?<span>help</span>
            </button>
          </>
        )}

        <button className="annotate-btn" onClick={() => setAnnotate((prevState) => !prevState)}>
          i
        </button>

        {annotate && item.annotations.map((annotate, idx) => (
          <button
            key={idx}
            className="Hotspot"
            slot={annotate.slot}
            data-position={annotate.position}
            data-normal={annotate.normal}
            data-orbit={annotate.orbit}
            data-target={annotate.target}
            data-visibility-attribute="visible"
            onClick={() => handleAnnotateClick(annotate)}
          >
            <div className="HotspotAnnotation">{annotate.title}</div>
          </button>
        ))}

        <div className="controls variant_div">
          <select ref={varient} id="variant"></select>
        </div>
      </model-viewer>

      <LazyLoad>
        <div className="qr-sec">
          {/* <QRCode id={item.name} value={window.location.href} size={110} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin /> */}

          <div className="product-details">
            <div>
              <div className="pname">{item.name}</div>
              <div className="rating-sec">

              </div>
              <div>Free</div>
            </div>

            <div className="flex flex-col items-center gap-4 p-4 bg-white rounded-lg shadow-md">
              <button
                className="w-10 h-10 flex items-center justify-center text-white bg-blue-500 hover:bg-blue-600 rounded-full transition"
                onClick={handleAddToWishlist}
              >
                {isInWishlist ? '-' : '+'}
              </button>

              <button
                className="w-full px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md transition"
                onClick={handleDownload}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      </LazyLoad>
    </div>
  );
};

export default ModelViewer;
