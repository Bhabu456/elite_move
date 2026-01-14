"use client"

import { useEffect, useState } from "react"
import { Button, Card } from "antd"
import {
  FiCheck,
  FiMapPin,
  FiPhone,
  FiMail,
  FiDownload,
  FiHome,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiTruck,
} from "react-icons/fi"
import { motion } from "framer-motion"
import dayjs from "dayjs"

export default function ConfirmationStep({ data, bookingId }) {
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const nextSteps = [
    { icon: FiPhone, title: "Get a Call", description: "Our team will call you within 2 hours to confirm details" },
    { icon: FiTruck, title: "Truck Assigned", description: "A truck and team will be assigned 24 hours before moving" },
    { icon: FiCalendar, title: "Moving Day", description: "Team arrives at pickup location on scheduled date" },
    { icon: FiCheck, title: "Job Done", description: "Items safely delivered and unpacked at new location" },
  ]

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 py-8">
      {/* Success Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
          className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
        >
          <FiCheck className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-bold text-gray-800 mb-2"
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mb-4"
        >
          Your moving request has been successfully submitted
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="inline-block bg-blue-100 text-blue-800 px-6 py-3 rounded-full"
        >
          <span className="text-sm">Booking ID</span>
          <p className="text-xl font-bold">{bookingId}</p>
        </motion.div>
      </div>

      {/* Route Visualization */}
      <Card className="shadow-sm border-0">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 p-4 bg-green-50 rounded-xl text-center">
            <FiMapPin className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm text-green-600 font-medium">Pickup</p>
            <p className="text-gray-800 font-semibold">{data.location?.pickup?.city}</p>
            <p className="text-sm text-gray-500">{data.location?.pickup?.pincode}</p>
          </div>

          <div className="hidden md:flex items-center gap-2 text-gray-400">
            <div className="w-16 h-0.5 bg-gray-300"></div>
            <FiArrowRight className="w-6 h-6" />
            <div className="w-16 h-0.5 bg-gray-300"></div>
          </div>

          <div className="flex-1 p-4 bg-red-50 rounded-xl text-center">
            <FiMapPin className="w-6 h-6 text-red-600 mx-auto mb-2" />
            <p className="text-sm text-red-600 font-medium">Drop</p>
            <p className="text-gray-800 font-semibold">{data.location?.drop?.city}</p>
            <p className="text-sm text-gray-500">{data.location?.drop?.pincode}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800">
              {data.location?.date ? dayjs(data.location.date).format("DD MMM YYYY") : "TBD"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="w-5 h-5 text-blue-600" />
            <span className="text-gray-800">Morning Slot</span>
          </div>
        </div>
      </Card>

      {/* What Happens Next */}
      <Card className="shadow-sm border-0">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">What Happens Next?</h3>

        <div className="space-y-4">
          {nextSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{step.title}</p>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Card>

      {/* Contact Info */}
      <Card className="shadow-sm border-0 bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>

        <div className="flex flex-col md:flex-row gap-4">
          <a
            href="tel:+911234567890"
            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <FiPhone className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Call Us</p>
              <p className="font-medium text-gray-800">+91 123 456 7890</p>
            </div>
          </a>

          <a
            href="mailto:support@moveeasy.com"
            className="flex items-center gap-3 p-4 bg-white rounded-xl hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <FiMail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Us</p>
              <p className="font-medium text-gray-800">support@moveeasy.com</p>
            </div>
          </a>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        <Button size="large" icon={<FiDownload className="w-4 h-4" />} className="h-12 flex-1">
          Download Receipt
        </Button>
        <Button
          type="primary"
          size="large"
          icon={<FiHome className="w-4 h-4" />}
          className="h-12 flex-1 bg-blue-600 hover:bg-blue-700"
          onClick={() => window.location.reload()}
        >
          Back to Home
        </Button>
      </div>
    </motion.div>
  )
}
