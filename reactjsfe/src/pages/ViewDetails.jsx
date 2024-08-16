import React from "react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import ChartComponent from "../component/ChartComponent";

function ViewDetails() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow p-4 md:p-8 lg:p-16">
        <ChartComponent />
      </main>
      <Footer />
    </div>
  );
}

export default ViewDetails;
