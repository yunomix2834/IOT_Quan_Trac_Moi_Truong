import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import TemperatureChart from "../component/TemperatureChat";
import HumidityChart from "../component/HumidityChart";
import MQ7Chart from "../component/MQ7Chart";

function ViewDetails() {
  return (
    <div className="flex flex-col h-auto">
      <Header />
      <main className="flex-grow p-4 mt-16 md:p-8 lg:p-16">
        <TemperatureChart />
        <HumidityChart />
        <MQ7Chart />
      </main>
      <Footer />
    </div>
  );
}

export default ViewDetails;
