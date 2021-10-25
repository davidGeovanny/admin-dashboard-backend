/*
SQLyog Ultimate v11.11 (64 bit)
MySQL - 5.5.5-10.4.14-MariaDB : Database - admin_dashboard
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `branches_company` */

DROP TABLE IF EXISTS `branches_company`;

CREATE TABLE `branches_company` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `branch` varchar(60) NOT NULL,
  `status` enum('activated','disabled') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `employees` */

DROP TABLE IF EXISTS `employees`;

CREATE TABLE `employees` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `first_lastname` varchar(50) NOT NULL,
  `second_lastname` varchar(50) NOT NULL,
  `gender` enum('male','female','undefined') NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `icebar_commission_config` */

DROP TABLE IF EXISTS `icebar_commission_config`;

CREATE TABLE `icebar_commission_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `min_range` int(10) unsigned NOT NULL DEFAULT 0,
  `max_range` int(10) unsigned NOT NULL DEFAULT 0,
  `cost_bar_operator` decimal(6,3) unsigned NOT NULL DEFAULT 0.000,
  `cost_bar_assistant` decimal(6,3) unsigned DEFAULT 0.000,
  `cost_bar_operator_assistant` decimal(6,3) unsigned DEFAULT 0.000,
  `id_branch_company` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_branch_company` (`id_branch_company`),
  CONSTRAINT `icebar_commission_config_ibfk_1` FOREIGN KEY (`id_branch_company`) REFERENCES `branches_company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `icecube_commission_config` */

DROP TABLE IF EXISTS `icecube_commission_config`;

CREATE TABLE `icecube_commission_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `non_commissionable_kg` decimal(7,2) unsigned DEFAULT 0.00,
  `percent_operator` decimal(6,3) unsigned NOT NULL DEFAULT 0.000,
  `percent_assistant` decimal(6,3) unsigned DEFAULT 0.000,
  `percent_operator_assistant` decimal(6,3) unsigned DEFAULT 0.000,
  `id_branch_company` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_branch_company` (`id_branch_company`),
  CONSTRAINT `icecube_commission_config_ibfk_1` FOREIGN KEY (`id_branch_company`) REFERENCES `branches_company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `profile_user` */

DROP TABLE IF EXISTS `profile_user`;

CREATE TABLE `profile_user` (
  `id_profile` int(10) unsigned NOT NULL,
  `id_user` int(10) unsigned NOT NULL,
  KEY `id_profile` (`id_profile`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `profile_user_ibfk_1` FOREIGN KEY (`id_profile`) REFERENCES `profiles` (`id`),
  CONSTRAINT `profile_user_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

/*Table structure for table `profiles` */

DROP TABLE IF EXISTS `profiles`;

CREATE TABLE `profiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `profile` varchar(100) NOT NULL,
  `default` tinyint(4) NOT NULL DEFAULT 0,
  `status` enum('activated','disabled') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `sales` */

DROP TABLE IF EXISTS `sales`;

CREATE TABLE `sales` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `branch_company` varchar(75) NOT NULL,
  `client` varchar(120) NOT NULL,
  `delivery_point_key` varchar(15) NOT NULL,
  `delivery_point` varchar(100) NOT NULL,
  `route_name` varchar(50) NOT NULL,
  `operator` varchar(120) NOT NULL,
  `assistant` varchar(120) DEFAULT NULL,
  `sales_folio` varchar(20) NOT NULL,
  `date` date NOT NULL,
  `hour` time DEFAULT NULL,
  `payment_method` enum('cash payment','credit payment') NOT NULL,
  `product` varchar(200) NOT NULL,
  `type_product` varchar(50) DEFAULT NULL,
  `original_price` decimal(20,5) unsigned NOT NULL,
  `quantity` decimal(8,3) unsigned NOT NULL,
  `type_modification` enum('discount','over price','without changes') NOT NULL,
  `modified_price` decimal(20,5) unsigned NOT NULL,
  `final_price` decimal(20,5) unsigned NOT NULL,
  `bonification` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4387 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(40) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` enum('activated','disabled','waiting activation') NOT NULL,
  `id_employee` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_employee` (`id_employee`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_employee`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4;

/*Table structure for table `water_commission_config` */

DROP TABLE IF EXISTS `water_commission_config`;

CREATE TABLE `water_commission_config` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `percent_operator` decimal(6,3) unsigned NOT NULL DEFAULT 0.000,
  `percent_assistant` decimal(6,3) unsigned DEFAULT 0.000,
  `percent_operator_assistant` decimal(6,3) unsigned DEFAULT 0.000,
  `id_branch_company` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_branch_company` (`id_branch_company`),
  CONSTRAINT `water_commission_config_ibfk_1` FOREIGN KEY (`id_branch_company`) REFERENCES `branches_company` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
