-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 19 jan. 2021 à 01:21
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
-- Base de données : `processcontrol`
--

-- --------------------------------------------------------

--
-- Structure de la table `sys_users`
--

CREATE TABLE `sys_users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `admin` int(11) NOT NULL,
  `process` int(11) NOT NULL,
  `direction` int(11) NOT NULL,
  `manager` int(11) NOT NULL,
  `superOperator` int(11) NOT NULL,
  `Operator` int(11) NOT NULL,
  `Factory` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `sys_users`
--

INSERT INTO `sys_users` (`id`, `name`, `email`, `username`, `password`, `admin`, `process`, `direction`, `manager`, `superOperator`, `Operator`, `Factory`) VALUES
(8, 'Christophe CARIOU', 'christophecariou.processcontrol@gmail.com', 'CCA', '$2a$10$7VcfowIMBXC.DoEIlYTycezWStbCUndNnCcU6PjonSmOhTeVNXSkC', 1, 0, 0, 0, 0, 0, 'Visitor'),
(9, 'Toto_24@hotmail.com', 'Toto_24@hotmail.com', 'Toto_24@hotmail.com', '$2a$10$OkzOozzssNEG0xnFy62FdOHSS.2Avpa20sMlASVemWO2exoPNDvRq', 1, 0, 0, 0, 0, 0, 'Visitor');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `sys_users`
--
ALTER TABLE `sys_users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `sys_users`
--
ALTER TABLE `sys_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
