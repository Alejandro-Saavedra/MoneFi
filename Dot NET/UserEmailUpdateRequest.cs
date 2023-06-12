using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Users
{
    public class UserEmailUpdateRequest
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(255)]
        public string Email { get; set; }

        [Required]
        [StringLength(100)]
        [RegularExpression("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$",
         ErrorMessage = "Password must be a minimum of 8 characters, and have at least one of each of the following: Uppercase letter, lowercase letter, number, and special character(#?!@$%^&*-).")]
        public string CurrentPassword { get; set; }
    }
}
