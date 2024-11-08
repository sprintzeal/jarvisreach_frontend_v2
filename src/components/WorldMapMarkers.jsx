import React, { useEffect, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highmaps";
import proj4 from "proj4";

if (typeof window !== "undefined") {
  window.Highcharts = Highcharts;
  window.proj4 = proj4;
}

const WorldMapMarkers = ({ data }) => {
  const [topology, setTopology] = useState(null);

  useEffect(() => {
    const fetchTopology = async () => {
      try {
        const topologyData = await fetch(
          "https://code.highcharts.com/mapdata/custom/world.topo.json"
        ).then((response) => response.json());
        setTopology(topologyData);
      } catch (error) {
        console.error("Error fetching topology:", error);
      }
    };

    fetchTopology();
  }, []);
  const dataPointsByCountry = data?.countries.reduce((acc, country) => {
    const countryName = country?.location?.country;
    acc[countryName] = (acc[countryName] || 0) + 1;
    return acc;
  }, {});

  const chartOptions = {
    chart: {
      map: topology,
    },

    title: {
      text: "",
    },

    accessibility: {
      description:
        "Map where city locations have been defined using " +
        "latitude/longitude.",
    },

    mapNavigation: {
      enabled: true,
    },

    tooltip: {
      headerFormat: "",
      formatter: function () {
        const countryName = this.point.name;
        const pointCount = dataPointsByCountry[countryName] || 0;

        return `<b>${countryName}</b><br>Users: ${pointCount}<br>`;
      },
    },

    series: [
      {
        name: "World",
        borderColor: "#A0A0A0",
        nullColor: "rgba(200, 200, 200, 0.3)",
        showInLegend: false,
      },
      {
        name: "Separators",
        type: "mapline",
        nullColor: "#707070",
        showInLegend: false,
        enableMouseTracking: false,
        accessibility: {
          enabled: false,
        },
      },
      {
        type: "mappoint",
        name: "Countries",
        accessibility: {
          point: {
            valueDescriptionFormat:
              "{xDescription}. Lat: " +
              "{point.lat:.2f}, lon: {point.lon:.2f}.",
          },
        },
        color: Highcharts.getOptions().colors[1],
        data: data?.countries?.map((country) => ({
          name: country?.location?.country,
          lat: country?.location?.lat,
          lon: country?.location?.lon,
        })),
      },
    ],
  };

  return (
    <div>
      {topology !== null ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
          constructorType={"mapChart"}
        />
      ) : (
        <p>Loading map data...</p>
      )}
    </div>
  );
};

export default WorldMapMarkers;
