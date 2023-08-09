-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 10, 2023 at 08:32 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `e-commerce website db`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `Cart_Id` int(11) NOT NULL,
  `Customer_Id` int(11) NOT NULL,
  `Date_Placed` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`Cart_Id`, `Customer_Id`, `Date_Placed`) VALUES
(1, 17, '2023-04-30'),
(2, 16, '2023-04-30'),
(4, 15, '2023-04-30'),
(5, 18, '2023-05-01'),
(7, 24, '2023-05-09'),
(8, 25, '2023-05-10');

-- --------------------------------------------------------

--
-- Table structure for table `cart_details`
--

CREATE TABLE `cart_details` (
  `Cart_Details_Id` int(11) NOT NULL,
  `Cart_Id` int(11) NOT NULL,
  `Product_Id` int(11) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `Piece_Price` float NOT NULL,
  `Total_Price` float NOT NULL,
  `Date_added` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_details`
--

INSERT INTO `cart_details` (`Cart_Details_Id`, `Cart_Id`, `Product_Id`, `Quantity`, `Piece_Price`, `Total_Price`, `Date_added`) VALUES
(29, 7, 41, 2, 5000, 10000, '2023-05-10'),
(33, 8, 41, 2, 5000, 10000, '2023-05-10'),
(34, 8, 43, 2, 6000, 12000, '2023-05-10');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Token` varchar(255) NOT NULL,
  `Role` tinyint(1) DEFAULT 0 COMMENT '0 for cust\r\n1 for admin',
  `PhoneNumber` int(11) DEFAULT NULL,
  `Address` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`Id`, `Name`, `Email`, `Password`, `Token`, `Role`, `PhoneNumber`, `Address`) VALUES
(15, 'ahmed wael', 'samir@gmail.com', '$2b$16$fSDwtFMgwt7322/MWtIC/.NMCGlSyn0/Jn84WS0qnREXt3Zgfjroe', 'ca31530fb3fc22313dec0af86184c37e', 0, 1211774556, '5 wasfi descret from abbasia'),
(16, 'ahmed wael', 'wael@gmail.com', '$2b$16$M/lZBxsCinVwguQYrktr3uRju1rP9r8medeAkefb8N6gE.v8rQrCu', '7115adbb551d89f8e0c43b567a57596b', 0, 1120990433, 'cairo egypt africa'),
(17, 'ahmed sayed', 'aAtef@gmail.com', '$2b$16$S2eTtGi5YEcOCDVdEMG1K.bstvRc8UvNuopN7PIeKGKI3v0OPcZze', '97d5d4ac073912bc8bc73380a1470dba', 0, 1211774554, 'el qoba el fedawia abbasia '),
(18, 'first admin', 'admin@admin.com', '$2b$16$TdLTRf7DyC1a.JzYsqW2DOjnmhLF1ncEBGmQsoRwi208VdemJsC6y', '95f12184faa79b3ec64202b7d453cd94', 1, 1211774554, '5 awemjms mnfmdnfdmnfnfgd '),
(24, 'Mahmoud sayed', 'msm@gmail.com', '$2b$16$sE411CoxEcg2zqp8HLhNXOQ.yieLrvR3rAGug5zV.5SAP7etNb5/q', '63d52c9437a1d19b775948d91344a19c', 0, 1120990433, '5  masr el gdida roxy '),
(25, 'ali sayed', 'hanym@gmail.com', '$2b$16$32ZCc0oST3NtiXch0W5Hz.zQic7F2Aj0WvbZY9pI.TAnz.jPBZeUG', 'f5c6ce2ab99e0bf1abf9f58cfa82d262', 0, 1120990433, '5   abbas el akaad ');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `Order_Id` int(11) NOT NULL,
  `Customer_Id` int(11) NOT NULL,
  `Order_Price` float NOT NULL,
  `Date_Created` date NOT NULL DEFAULT current_timestamp(),
  `Status` int(11) NOT NULL DEFAULT 0 COMMENT '0 => not paid\r\n1 => paid',
  `Shipping_Region` varchar(255) NOT NULL,
  `Shipping_Cost` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`Order_Id`, `Customer_Id`, `Order_Price`, `Date_Created`, `Status`, `Shipping_Region`, `Shipping_Cost`) VALUES
(22, 24, 24000, '2023-05-09', 1, 'tanta', 150),
(24, 24, 24000, '2023-05-09', 1, 'tanta', 150),
(25, 24, 24000, '2023-05-09', 1, 'cairo', 50),
(26, 24, 10000, '2023-05-10', 1, 'cairo', 50),
(27, 24, 10000, '2023-05-10', 1, 'cairo', 50),
(29, 25, 10000, '2023-05-10', 1, 'tanta', 150);

-- --------------------------------------------------------

--
-- Table structure for table `payment_by_cash`
--

CREATE TABLE `payment_by_cash` (
  `Payment_Id` int(11) NOT NULL,
  `Customer_Id` int(11) NOT NULL,
  `Order_Id` int(11) NOT NULL,
  `Payment_Amount` float NOT NULL,
  `Pay_Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment_by_cash`
--

INSERT INTO `payment_by_cash` (`Payment_Id`, `Customer_Id`, `Order_Id`, `Payment_Amount`, `Pay_Date`) VALUES
(6, 24, 24, 24150, '2023-05-09'),
(7, 24, 26, 10050, '2023-05-10'),
(8, 24, 27, 10050, '2023-05-10'),
(9, 25, 29, 10150, '2023-05-10');

-- --------------------------------------------------------

--
-- Table structure for table `payment_by_credit`
--

CREATE TABLE `payment_by_credit` (
  `Id` int(11) NOT NULL,
  `Customer_Id` int(11) NOT NULL,
  `Order_Id` int(11) NOT NULL,
  `Card_Number` bigint(16) NOT NULL,
  `Card_Tybe` varchar(255) NOT NULL,
  `Payment_Amount` int(11) NOT NULL,
  `Exp_Date` varchar(255) NOT NULL,
  `Pay_Date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `payment_by_credit`
--

INSERT INTO `payment_by_credit` (`Id`, `Customer_Id`, `Order_Id`, `Card_Number`, `Card_Tybe`, `Payment_Amount`, `Exp_Date`, `Pay_Date`) VALUES
(5, 24, 22, 1234567891012134, 'master card', 24150, '02/23', '2023-05-09'),
(6, 24, 25, 1234567891012134, 'master card', 24050, '02/23', '2023-05-09');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `Id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `Price` float NOT NULL,
  `Image_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`Id`, `Name`, `Description`, `Price`, `Image_url`) VALUES
(41, 'Nokia G21', 'Nokia G21 Android Smartphone, Dual Sim, 4GB RAM, 128GB Memory, 6.5HD+ Screen, 5050mAh battery, Android 12 Ready, Face Unlock, Finger Print Sensor – Blue', 5000, '1683646540100.jpg'),
(43, 'Redmi Note 11', 'Redmi Note11, 6GB RAM, 128GB ROM - Graphite Gray', 6000, '1683692885512.jpeg'),
(45, 'Redmi Note 10', 'Xiaomi Redmi Note 10, 5G, Graphite Grey, 128GB,6G RAM Dual SIM Grey', 8000, '1683654727805.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `Shipping_Id` int(11) NOT NULL,
  `Customer_Id` int(11) NOT NULL,
  `Shipping_Cost` int(11) NOT NULL,
  `Shipping_Region_Name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`Shipping_Id`, `Customer_Id`, `Shipping_Cost`, `Shipping_Region_Name`) VALUES
(2, 24, 50, 'cairo'),
(3, 24, 50, 'cairo'),
(4, 25, 150, 'tanta');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`Cart_Id`),
  ADD KEY `Customer_Id` (`Customer_Id`);

--
-- Indexes for table `cart_details`
--
ALTER TABLE `cart_details`
  ADD PRIMARY KEY (`Cart_Details_Id`),
  ADD KEY `Cart_Id` (`Cart_Id`),
  ADD KEY `Product_const_Id` (`Product_Id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`Order_Id`),
  ADD KEY `Cust_Id` (`Customer_Id`);

--
-- Indexes for table `payment_by_cash`
--
ALTER TABLE `payment_by_cash`
  ADD PRIMARY KEY (`Payment_Id`),
  ADD KEY `CustId` (`Customer_Id`),
  ADD KEY `Ord_ID` (`Order_Id`);

--
-- Indexes for table `payment_by_credit`
--
ALTER TABLE `payment_by_credit`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`Id`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`Shipping_Id`),
  ADD KEY `Customer_Shipping_const_id` (`Customer_Id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `Cart_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `cart_details`
--
ALTER TABLE `cart_details`
  MODIFY `Cart_Details_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `Order_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `payment_by_cash`
--
ALTER TABLE `payment_by_cash`
  MODIFY `Payment_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payment_by_credit`
--
ALTER TABLE `payment_by_credit`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `Shipping_Id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `Customer_Id` FOREIGN KEY (`Customer_Id`) REFERENCES `customer` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cart_details`
--
ALTER TABLE `cart_details`
  ADD CONSTRAINT `Cart_Id` FOREIGN KEY (`Cart_Id`) REFERENCES `cart` (`Cart_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_const_Id` FOREIGN KEY (`Product_Id`) REFERENCES `product` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `payment_by_cash`
--
ALTER TABLE `payment_by_cash`
  ADD CONSTRAINT `CustId` FOREIGN KEY (`Customer_Id`) REFERENCES `customer` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Ord_ID` FOREIGN KEY (`Order_Id`) REFERENCES `order` (`Order_Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `Customer_Shipping_const_id` FOREIGN KEY (`Customer_Id`) REFERENCES `customer` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
