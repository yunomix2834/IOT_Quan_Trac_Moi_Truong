import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import SensorDataChart from "../component/SensorDataChart";

function ViewDetails() {
  return (
    <div className="flex flex-col h-auto">
      <Header />
      <main className="flex-grow p-4 mt-24 md:p-8 space-y-10 lg:p-16">
        <SensorDataChart />
      </main>
      <Footer />
    </div>
  );
}

export default ViewDetails;
