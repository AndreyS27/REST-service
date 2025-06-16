using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class StudentsController : ControllerBase
{
    private readonly StudentService _studentService;

    public StudentsController(StudentService studentService)
    {
        _studentService = studentService;
    }

    [HttpGet]
    public IActionResult Search(string? firstName, string? lastName, int? age,
                                string? phoneNumber, string? major)
    {
        return Ok(_studentService.SearchStudents(firstName, lastName, age, phoneNumber, major));
    }
    // Изменить StudentDto
    [HttpPost("add")]
    public IActionResult Add([FromBody] StudentDto student)
    {
        var res = _studentService.AddStudent(
                        student.FirstName,
                        student.LastName,
                        student.Age,
                        student.PhoneNumber,
                        student.Major);
        if (res)
        {
            return Ok(res);
        }
        return BadRequest();
    }

    [HttpDelete("delete/{id}")]
    public IActionResult Delete(int id)
    {
        bool res = _studentService.DeleteStudent(id);
        if (res) return NoContent();
        return BadRequest("Ошибка id");
    }

    [HttpPut("update/{id}")]
    public IActionResult Update(int id, [FromBody] StudentDto student)
    {

        var updatedStudent = _studentService.UpdateStudent(
            id,
            student.FirstName,
            student.LastName,
            student.Age,
            student.PhoneNumber,
            student.Major
        );

        if (!updatedStudent)
            return NotFound($"Студент с Id {id} не найден");

        return Ok(updatedStudent);
    }
}