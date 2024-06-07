data "terraform_remote_state" "upstream" {
  backend = "s3"
  config = {
    bucket = var.terraform_bucket_name
    region = "us-east-1"
    key = "${var.atmos_env}/terraform.tfstate"
  }
}
