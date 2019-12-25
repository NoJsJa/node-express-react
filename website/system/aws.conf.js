exports.writeProtectionPolicy = {
  "Sid": "writeProtection",
    "Effect": "Deny",
    "Action": [
      // "s3:CreateBucket",
      "s3:DeleteBucketPolicy",
      "s3:DeleteBucket",
      "s3:DeleteBucketWebsite",
      "s3:DeleteObject",
      "s3:DeleteObjectTagging",
      "s3:DeleteObjectVersion",
      "s3:DeleteObjectVersionTagging",
      "S3:PutAccelerateConfiguration",
      "s3:PutBucketAcl",
      "s3:PutBucketCORS",
      "s3:PutBucketLogging",
      "s3:PutBucketNotification",
      "s3:PutBucketPolicy",
      "s3:PutBucketRequestPayment",
      "s3:PutBucketTagging",
      "s3:PutBucketVersioning",
      "s3:PutBucketWebsite",
      "s3:PutLifecycleConfiguration",
      "s3:PutObjectAcl",
      // "s3:PutObject",
      "s3:PutObjectVersionAcl",
      "s3:PutReplicationConfiguration",
    ],
    "Resource": [
        "arn:aws:s3:::*"
    ]
}
