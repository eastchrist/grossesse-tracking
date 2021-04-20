-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : lun. 22 mars 2021 à 22:00
-- Version du serveur :  10.4.14-MariaDB
-- Version de PHP : 7.4.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `processcontrol_db_dev`
--

-- --------------------------------------------------------

--
-- Structure de la table `factory`
--

CREATE TABLE `factory` (
  `id` int(11) NOT NULL,
  `idNode` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `name1` varchar(255) NOT NULL,
  `position` int(11) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `currency` varchar(255) DEFAULT NULL,
  `currencyEuro` float DEFAULT NULL,
  `isCartography` tinyint(1) DEFAULT NULL,
  `isOptimisation` tinyint(1) DEFAULT NULL,
  `isTraceability` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `factory`
--
ALTER TABLE `factory`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `factory`
--
ALTER TABLE `factory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
